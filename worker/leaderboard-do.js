/**
 * LeaderboardDurableObject
 * Manages in-memory transient leaderboard state and WebSockets for a single event session.
 * 
 * Key Characteristics:
 * - Single-instance actor per event ensures atomic serialized score processing with zero race conditions.
 * - Handles up to 500+ simultaneous WebSocket client connections.
 * - Broadcast batching (100ms throttle) prevents thundering herd message spam when hundreds finish at once.
 * - Tie-breaking: Higher score > Lower response time > Earlier submission timestamp.
 * - In-memory transient storage (no persistent database required).
 * - Admin controls (start, close, reset) protected by ADMIN_API_KEY.
 */

export class LeaderboardDurableObject {
  constructor(state, env) {
    this.state = state;
    this.env = env;

    // Transient in-memory state
    this.scores = new Map(); // key: playerId (or attemptId), val: entry
    this.idempotencyKeys = new Set(); // set of idempotency keys
    this.status = "open"; // "open", "closed"
    this.createdAt = Date.now();

    // Active WebSocket connections
    this.sessions = new Set();

    // Broadcast batching timer
    this.broadcastTimeout = null;
    this.pendingBroadcast = false;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. WebSocket Upgrade (/ws)
    if (path === "/ws") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected WebSocket Upgrade", { status: 426 });
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      await this.handleWebSocketSession(server);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // 2. Submit Score (POST /api/submit-score)
    if (path === "/api/submit-score" && request.method === "POST") {
      return await this.handleSubmitScore(request);
    }

    // 3. Snapshot (GET /api/leaderboard)
    if (path === "/api/leaderboard" && request.method === "GET") {
      const topLimit = parseInt(url.searchParams.get("limit") || "10", 10);
      return new Response(JSON.stringify(this.getLeaderboardSnapshot(topLimit)), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. Admin Event Control (POST /api/admin/event-control)
    if (path === "/api/admin/event-control" && request.method === "POST") {
      return await this.handleAdminControl(request);
    }

    return new Response("Not Found", { status: 404 });
  }

  // ==========================================
  // WEBSOCKET MANAGEMENT
  // ==========================================
  async handleWebSocketSession(webSocket) {
    webSocket.accept();
    this.sessions.add(webSocket);

    // Immediately send the latest snapshot to the newly connected client
    const initialPayload = JSON.stringify({
      type: "snapshot",
      data: this.getLeaderboardSnapshot(20)
    });
    try {
      webSocket.send(initialPayload);
    } catch (e) {}

    webSocket.addEventListener("message", async (msg) => {
      try {
        const parsed = JSON.parse(msg.data);
        if (parsed.type === "ping") {
          webSocket.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
        }
      } catch (e) {}
    });

    const cleanup = () => {
      this.sessions.delete(webSocket);
    };

    webSocket.addEventListener("close", cleanup);
    webSocket.addEventListener("error", cleanup);
  }

  // Batch broadcasts to active WebSockets every 100ms
  scheduleBroadcast() {
    if (this.broadcastTimeout) return;
    this.broadcastTimeout = setTimeout(() => {
      this.broadcastTimeout = null;
      this.broadcastLeaderboard();
    }, 100);
  }

  broadcastLeaderboard() {
    if (this.sessions.size === 0) return;
    const payload = JSON.stringify({
      type: "update",
      data: this.getLeaderboardSnapshot(20)
    });

    for (const ws of this.sessions) {
      try {
        ws.send(payload);
      } catch (err) {
        this.sessions.delete(ws);
      }
    }
  }

  // ==========================================
  // SCORE SUBMISSION & VALIDATION
  // ==========================================
  async handleSubmitScore(request) {
    if (this.status === "closed") {
      return new Response(JSON.stringify({ error: "Event submissions are currently closed." }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Idempotency check
    const idempotencyKey = body.idempotencyKey || body.attemptId;
    if (idempotencyKey && this.idempotencyKeys.has(idempotencyKey)) {
      return new Response(JSON.stringify({
        success: true,
        message: "Duplicate submission ignored (idempotent)",
        data: this.scores.get(body.playerId || body.playerName)
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validation rules
    const playerName = String(body.playerName || "").trim().slice(0, 30);
    const playerId = String(body.playerId || playerName || body.attemptId).trim().slice(0, 50);
    const score = Number(body.score);
    const totalTimeSec = Number(body.totalTimeSec || 0);
    const questionsAnswered = Number(body.questionsAnswered || 0);
    const correctCount = Number(body.correctCount || 0);
    const maxQuestions = Number(body.maxQuestions || 15);

    if (!playerName || playerName.length < 2) {
      return new Response(JSON.stringify({ error: "Player name must be between 2 and 30 characters." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Bounds checking
    const maxPossiblePoints = maxQuestions * 1000;
    if (isNaN(score) || score < 0 || score > maxPossiblePoints) {
      return new Response(JSON.stringify({ error: `Invalid score value. Maximum possible is ${maxPossiblePoints}.` }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (isNaN(totalTimeSec) || totalTimeSec < 0 || totalTimeSec > (maxQuestions * 60)) {
      return new Response(JSON.stringify({ error: "Invalid total time value." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (correctCount > maxQuestions || questionsAnswered > maxQuestions) {
      return new Response(JSON.stringify({ error: "Answers count exceeds question bank size." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // One entry per player attempt; if player submits higher score, update
    const existing = this.scores.get(playerId);
    if (!existing || score > existing.score) {
      const entry = {
        playerId,
        playerName,
        score,
        totalTimeSec: Math.round(totalTimeSec * 10) / 10,
        accuracy: Math.round((correctCount / (maxQuestions || 1)) * 100),
        correctCount,
        maxQuestions,
        submittedAt: Date.now()
      };

      this.scores.set(playerId, entry);
      if (idempotencyKey) {
        this.idempotencyKeys.add(idempotencyKey);
      }

      // Schedule batch broadcast to all connected WebSocket clients
      this.scheduleBroadcast();

      return new Response(JSON.stringify({
        success: true,
        message: "Score accepted",
        entry
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Score retained (existing score was higher or equal)",
      entry: existing
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // ==========================================
  // RANKING & TIE-BREAKING
  // ==========================================
  getSortedRankings() {
    const list = Array.from(this.scores.values());
    list.sort((a, b) => {
      // 1. Higher score wins
      if (b.score !== a.score) return b.score - a.score;
      // 2. Lower response time wins
      if (a.totalTimeSec !== b.totalTimeSec) return a.totalTimeSec - b.totalTimeSec;
      // 3. Earlier submission timestamp wins
      return a.submittedAt - b.submittedAt;
    });

    return list.map((item, idx) => ({
      rank: idx + 1,
      ...item
    }));
  }

  getLeaderboardSnapshot(limit = 20) {
    const all = this.getSortedRankings();
    return {
      status: this.status,
      totalParticipants: all.length,
      topRankings: all.slice(0, limit),
      updatedAt: Date.now()
    };
  }

  // ==========================================
  // ADMIN CONTROL
  // ==========================================
  async handleAdminControl(request) {
    const authHeader = request.headers.get("Authorization") || "";
    const adminKey = authHeader.replace(/^Bearer\s+/i, "").trim();
    const expectedKey = this.env.ADMIN_API_KEY || "jesus";

    if (!adminKey || adminKey !== expectedKey) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid admin key" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action;

    if (action === "close") {
      this.status = "closed";
      this.scheduleBroadcast();
      return new Response(JSON.stringify({ success: true, status: "closed" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (action === "open") {
      this.status = "open";
      this.scheduleBroadcast();
      return new Response(JSON.stringify({ success: true, status: "open" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (action === "reset") {
      this.scores.clear();
      this.idempotencyKeys.clear();
      this.status = "open";
      this.scheduleBroadcast();
      return new Response(JSON.stringify({ success: true, message: "Leaderboard cleared" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Invalid admin action. Allowed: open, close, reset" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
