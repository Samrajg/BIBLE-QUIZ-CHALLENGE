/**
 * Automated Test Suite for Bible Quiz Live Leaderboard
 * Validates:
 * 1. Valid score submission
 * 2. Invalid score rejection (out-of-bounds, invalid name)
 * 3. Duplicate submission prevention (idempotency)
 * 4. Deterministic tie-breaking (Score > Total Time > Timestamp)
 * 5. Event isolation (Event A does not leak into Event B)
 * 6. Unauthorized admin request rejection
 * 7. Admin control actions (open, close, reset)
 * 8. Real-time WebSocket connection, initial snapshot, and broadcast updates
 */

const http = require("http");
const WebSocket = require("ws");

const BASE_URL = "http://localhost:8787";
const WS_URL = "ws://localhost:8787";

function postJson(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      `${BASE_URL}${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          ...headers
        }
      },
      (res) => {
        let resData = "";
        res.on("data", chunk => resData += chunk);
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resData) });
          } catch (e) {
            resolve({ status: res.statusCode, text: resData });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function getJson(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `${BASE_URL}${path}`,
      { method: "GET", headers },
      (res) => {
        let resData = "";
        res.on("data", chunk => resData += chunk);
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resData) });
          } catch (e) {
            resolve({ status: res.statusCode, text: resData });
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING LIVE LEADERBOARD FUNCTIONAL TEST SUITE");
  console.log("==================================================");

  const testEvent = `test-event-${Date.now()}`;

  // 1. Reset event state
  console.log("\n[Test 1] Reset Event State (Authorized Admin)");
  const resetRes = await postJson(`/api/admin/event-control?event=${testEvent}`, { action: "reset" }, {
    "Authorization": "Bearer jesus"
  });
  assert(resetRes.status === 200, "Reset should return 200");
  assert(resetRes.data.success === true, "Reset should succeed");
  console.log("  ✓ Reset successful");

  // 2. Reject Unauthorized Admin
  console.log("\n[Test 2] Reject Unauthorized Admin Access");
  const unauthRes = await postJson(`/api/admin/event-control?event=${testEvent}`, { action: "reset" }, {
    "Authorization": "Bearer wrong-password"
  });
  assert(unauthRes.status === 401, "Unauthorized admin should return 401");
  console.log("  ✓ Unauthorized admin correctly blocked with 401");

  // 3. Valid Score Submission
  console.log("\n[Test 3] Submit Valid Scores");
  const sub1 = await postJson(`/api/submit-score?event=${testEvent}`, {
    playerName: "Noah",
    score: 8500,
    totalTimeSec: 45.2,
    correctCount: 10,
    maxQuestions: 15,
    attemptId: "ATT-1001"
  });
  assert(sub1.status === 200, "Valid submission should return 200");
  assert(sub1.data.entry.playerName === "Noah", "Player name should be Noah");
  assert(sub1.data.entry.score === 8500, "Score should match 8500");
  console.log("  ✓ Valid score recorded successfully");

  // 4. Duplicate Submission (Idempotency)
  console.log("\n[Test 4] Duplicate Submission Idempotency");
  const subDup = await postJson(`/api/submit-score?event=${testEvent}`, {
    playerName: "Noah",
    score: 8500,
    totalTimeSec: 45.2,
    correctCount: 10,
    maxQuestions: 15,
    attemptId: "ATT-1001"
  });
  assert(subDup.status === 200, "Duplicate should return 200 (idempotent)");
  assert(subDup.data.message.includes("idempotent"), "Message should mention idempotent duplicate");
  console.log("  ✓ Duplicate submission handled idempotently without error");

  // 5. Invalid Score Rejection
  console.log("\n[Test 5] Reject Invalid Out-of-Bounds Scores");
  const subInvalidScore = await postJson(`/api/submit-score?event=${testEvent}`, {
    playerName: "Hacker",
    score: 999999, // Impossible score (max 15 * 1000 = 15000)
    maxQuestions: 15
  });
  assert(subInvalidScore.status === 400, "Out-of-bounds score should return 400");
  console.log("  ✓ Tampered/out-of-bounds score successfully rejected");

  const subInvalidName = await postJson(`/api/submit-score?event=${testEvent}`, {
    playerName: "X", // Too short
    score: 5000,
    maxQuestions: 15
  });
  assert(subInvalidName.status === 400, "Short name should return 400");
  console.log("  ✓ Invalid player name successfully rejected");

  // 6. Deterministic Tie-Breaking (Score > Time > Timestamp)
  console.log("\n[Test 6] Deterministic Tie-Breaking Order");
  // Player A: 12000 pts in 40.0s
  await postJson(`/api/submit-score?event=${testEvent}`, {
    playerName: "Moses",
    score: 12000,
    totalTimeSec: 40.0,
    attemptId: "ATT-MOSES"
  });
  // Player B: 12000 pts in 35.0s (Faster -> should rank HIGHER than Moses)
  await postJson(`/api/submit-score?event=${testEvent}`, {
    playerName: "David",
    score: 12000,
    totalTimeSec: 35.0,
    attemptId: "ATT-DAVID"
  });
  // Player C: 14000 pts in 60.0s (Higher score -> Rank 1)
  await postJson(`/api/submit-score?event=${testEvent}`, {
    playerName: "Solomon",
    score: 14000,
    totalTimeSec: 60.0,
    attemptId: "ATT-SOLOMON"
  });

  const lbRes = await getJson(`/api/leaderboard?event=${testEvent}`);
  const ranks = lbRes.data.topRankings;
  assert(ranks[0].playerName === "Solomon", "Rank 1 should be Solomon (highest score 14000)");
  assert(ranks[1].playerName === "David", "Rank 2 should be David (tied at 12000, faster 35.0s)");
  assert(ranks[2].playerName === "Moses", "Rank 3 should be Moses (tied at 12000, slower 40.0s)");
  assert(ranks[3].playerName === "Noah", "Rank 4 should be Noah (score 8500)");
  console.log("  ✓ Tie-breaking verified: Solomon (14k) > David (12k/35s) > Moses (12k/40s) > Noah (8.5k)");

  // 7. Event Isolation
  console.log("\n[Test 7] Event Isolation (Multi-tenant check)");
  const isolatedEvent = `isolated-event-${Date.now()}`;
  const isolatedLb = await getJson(`/api/leaderboard?event=${isolatedEvent}`);
  assert(isolatedLb.data.totalParticipants === 0, "New event should have 0 participants");
  console.log("  ✓ Event isolation confirmed; rankings do not leak across events");

  // 8. WebSocket Snapshot and Real-time Broadcast
  console.log("\n[Test 8] WebSocket Connection & Live Broadcast Delivery");
  await new Promise((resolve, reject) => {
    const ws = new WebSocket(`${WS_URL}/ws?event=${testEvent}`);
    let receivedSnapshot = false;

    ws.on("open", () => {
      // WS opened
    });

    ws.on("message", (msg) => {
      const parsed = JSON.parse(msg);
      if (parsed.type === "snapshot") {
        receivedSnapshot = true;
        assert(parsed.data.totalParticipants === 4, "Snapshot should include 4 participants");
        // Now submit another score to trigger a live update
        postJson(`/api/submit-score?event=${testEvent}`, {
          playerName: "Esther",
          score: 15000,
          totalTimeSec: 25.0,
          attemptId: "ATT-ESTHER"
        }).catch(reject);
      } else if (parsed.type === "update") {
        assert(receivedSnapshot, "Snapshot should precede update");
        assert(parsed.data.topRankings[0].playerName === "Esther", "Esther should now lead at Rank 1");
        ws.close();
        console.log("  ✓ WebSocket snapshot received and live update broadcast confirmed");
        resolve();
      }
    });

    ws.on("error", reject);
    setTimeout(() => reject(new Error("WebSocket test timeout")), 5000);
  });

  // 9. Event Closure Behavior
  console.log("\n[Test 9] Event Closure Behavior");
  await postJson(`/api/admin/event-control?event=${testEvent}`, { action: "close" }, {
    "Authorization": "Bearer jesus"
  });
  const closedSub = await postJson(`/api/submit-score?event=${testEvent}`, {
    playerName: "LatePlayer",
    score: 10000,
    attemptId: "ATT-LATE"
  });
  assert(closedSub.status === 403, "Submissions to closed event must return 403");
  console.log("  ✓ Submissions correctly blocked when event is closed");

  console.log("\n==================================================");
  console.log("🎉 ALL FUNCTIONAL TESTS PASSED PERFECTLY!");
  console.log("==================================================");
}

runTests().catch(err => {
  console.error("\n❌ Test Suite Failed:", err);
  process.exit(1);
});
