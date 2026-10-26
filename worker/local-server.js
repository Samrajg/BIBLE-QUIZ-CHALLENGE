/**
 * Local Standalone Emulator for Cloudflare Worker + Durable Object
 * Runs using native Node.js HTTP + ws to allow 100% reproducible local development
 * and automated load testing for 100, 250, and 500 concurrent virtual users.
 */

const http = require("http");
const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 8787;

class LocalDurableObjectSession {
  constructor(eventId) {
    this.eventId = eventId;
    this.scores = new Map();
    this.idempotencyKeys = new Set();
    this.status = "open";
    this.sessions = new Set();
    this.broadcastTimeout = null;
  }

  getSortedRankings() {
    const list = Array.from(this.scores.values());
    list.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.totalTimeSec !== b.totalTimeSec) return a.totalTimeSec - b.totalTimeSec;
      return a.submittedAt - b.submittedAt;
    });
    return list.map((item, idx) => ({ rank: idx + 1, ...item }));
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
      if (ws.readyState === 1) { // OPEN
        try { ws.send(payload); } catch (e) {}
      }
    }
  }

  submitScore(body) {
    if (this.status === "closed") {
      return { status: 403, body: { error: "Event submissions are closed." } };
    }

    const idempotencyKey = body.idempotencyKey || body.attemptId;
    if (idempotencyKey && this.idempotencyKeys.has(idempotencyKey)) {
      return {
        status: 200,
        body: {
          success: true,
          message: "Duplicate submission ignored (idempotent)",
          data: this.scores.get(body.playerId || body.playerName)
        }
      };
    }

    const rawPlayerName = String(body.playerName || "").trim().slice(0, 30);
    const validNameRegex = /^[a-zA-Z0-9 _\-\u0B80-\u0BFF]{2,30}$/;
    if (!rawPlayerName || !validNameRegex.test(rawPlayerName)) {
      return { status: 400, body: { error: "Invalid player name. Only letters, numbers, spaces, and Tamil characters are allowed." } };
    }

    const playerName = rawPlayerName;
    const playerId = String(body.playerId || playerName || body.attemptId).trim().slice(0, 50);
    const score = Number(body.score);
    const totalTimeSec = Number(body.totalTimeSec || 0);
    const correctCount = Number(body.correctCount || 0);
    const maxQuestions = Number(body.maxQuestions || 15);

    // Anti-Cheat / Impossible Speed Guard
    const minPhysicalTimeSec = Math.max(1, correctCount * 0.4);
    if (correctCount > 0 && totalTimeSec < minPhysicalTimeSec) {
      return { status: 400, body: { error: "Score rejected: completion time is physically impossible." } };
    }

    const maxPoints = maxQuestions * 1000;
    if (isNaN(score) || score < 0 || score > maxPoints) {
      return { status: 400, body: { error: `Invalid score. Max allowed: ${maxPoints}.` } };
    }

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
      if (idempotencyKey) this.idempotencyKeys.add(idempotencyKey);
      this.scheduleBroadcast();
      return { status: 200, body: { success: true, message: "Score accepted", entry } };
    }

    return { status: 200, body: { success: true, message: "Existing score retained", entry: existing } };
  }
}

// In-memory sessions by event ID
const eventSessions = new Map();
function getEventSession(eventId = "default-event") {
  const sanitized = eventId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "default-event";
  if (!eventSessions.has(sanitized)) {
    eventSessions.set(sanitized, new LocalDurableObjectSession(sanitized));
  }
  return eventSessions.get(sanitized);
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Event-Id");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost:8787"}`);
  const eventId = url.searchParams.get("event") || req.headers["x-event-id"] || "default-event";
  const session = getEventSession(eventId);

  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "healthy", timestamp: Date.now() }));
    return;
  }

  if (url.pathname === "/api/leaderboard" && req.method === "GET") {
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(session.getLeaderboardSnapshot(limit)));
    return;
  }

  if (url.pathname === "/api/submit-score" && req.method === "POST") {
    let bodyStr = "";
    req.on("data", chunk => { bodyStr += chunk; });
    req.on("end", () => {
      try {
        const body = JSON.parse(bodyStr);
        const result = session.submitScore(body);
        res.writeHead(result.status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result.body));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON payload" }));
      }
    });
    return;
  }

  if (url.pathname === "/api/admin/event-control" && req.method === "POST") {
    const auth = req.headers["authorization"] || "";
    const key = auth.replace(/^Bearer\s+/i, "").trim();
    if (key !== "jesus") {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized: Invalid admin key" }));
      return;
    }
    let bodyStr = "";
    req.on("data", chunk => { bodyStr += chunk; });
    req.on("end", () => {
      try {
        const body = JSON.parse(bodyStr);
        if (body.action === "close") {
          session.status = "closed";
          session.scheduleBroadcast();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, status: "closed" }));
        } else if (body.action === "open") {
          session.status = "open";
          session.scheduleBroadcast();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, status: "open" }));
        } else if (body.action === "reset") {
          session.scores.clear();
          session.idempotencyKeys.clear();
          session.status = "open";
          session.scheduleBroadcast();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Leaderboard cleared" }));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid action" }));
        }
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid payload" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

// Attach WebSocket Server
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost:8787"}`);
  if (url.pathname === "/ws") {
    if (session.sessions.size >= 600) {
      socket.write("HTTP/1.1 503 Service Unavailable\r\n\r\nEvent capacity reached");
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      const eventId = url.searchParams.get("event") || "default-event";
      const session = getEventSession(eventId);
      session.sessions.add(ws);

      // Send initial snapshot
      ws.send(JSON.stringify({
        type: "snapshot",
        data: session.getLeaderboardSnapshot(20)
      }));

      ws.on("message", (msg) => {
        try {
          const parsed = JSON.parse(msg);
          if (parsed.type === "ping") ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
        } catch (e) {}
      });

      ws.on("close", () => session.sessions.delete(ws));
      ws.on("error", () => session.sessions.delete(ws));
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`Leaderboard Durable Object Server listening on http://localhost:${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
});
