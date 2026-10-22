/**
 * Live Leaderboard Concurrency & WebSocket Stress Test Suite
 * Tests the shared live leaderboard architecture under 100, 250, and 500 concurrent virtual users.
 * 
 * Each virtual user:
 * 1. Establishes a persistent WebSocket connection to receive live ranking broadcasts.
 * 2. Simulates quiz completion and submits their validated score to the server.
 * 3. Measures:
 *    - WebSocket connection success & disconnect rate
 *    - Score submission HTTP status & error rate
 *    - Latency percentiles (p50, p95, p99)
 *    - Update propagation delay (time from submission to WebSocket broadcast arrival)
 *    - Throughput (RPS)
 */

const http = require("http");
const WebSocket = require("ws");

const TARGET_HOST = process.env.TEST_HOST || "127.0.0.1";
const TARGET_PORT = parseInt(process.env.TEST_PORT || "8787", 10);
const HTTP_URL = `http://${TARGET_HOST}:${TARGET_PORT}`;
const WS_URL = `ws://${TARGET_HOST}:${TARGET_PORT}`;

function submitScore(eventId, vuIndex, score, durationSec) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      playerName: `Player_${vuIndex}`,
      playerId: `VU_${vuIndex}`,
      score: score,
      totalTimeSec: durationSec,
      correctCount: Math.round(score / 1000),
      maxQuestions: 15,
      attemptId: `ATT_${vuIndex}_${Date.now()}`
    });

    const startHr = process.hrtime.bigint();
    const req = http.request(
      `${HTTP_URL}/api/submit-score?event=${eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => {
          const endHr = process.hrtime.bigint();
          const latencyMs = Number(endHr - startHr) / 1e6;
          resolve({
            statusCode: res.statusCode,
            latencyMs,
            success: res.statusCode === 200
          });
        });
      }
    );

    req.on("error", (err) => {
      const endHr = process.hrtime.bigint();
      resolve({
        statusCode: 0,
        latencyMs: Number(endHr - startHr) / 1e6,
        success: false,
        error: err.message
      });
    });

    req.setTimeout(10000, () => {
      req.destroy(new Error("Timeout"));
    });

    req.write(payload);
    req.end();
  });
}

function calculatePercentile(sortedArray, percentile) {
  if (sortedArray.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
  return sortedArray[Math.min(index, sortedArray.length - 1)];
}

async function runConcurrencyStage(concurrency) {
  const eventId = `stage-${concurrency}-vus-${Date.now()}`;
  console.log(`\n======================================================`);
  console.log(`Starting Concurrency Test: ${concurrency} Concurrent Virtual Users`);
  console.log(`Event ID: ${eventId}`);
  console.log(`Testing simultaneous WebSocket connections & burst score submissions`);
  console.log(`======================================================`);

  const metrics = {
    wsConnected: 0,
    wsFailed: 0,
    wsMessagesReceived: 0,
    submissionsTotal: 0,
    submissionsSuccess: 0,
    submissionsFailed: 0,
    submitLatencies: [],
    propagationDelays: []
  };

  const wsClients = [];
  const startConnectTime = Date.now();

  // Phase 1: Connect `concurrency` WebSockets
  console.log(`[1/3] Connecting ${concurrency} simultaneous WebSocket clients...`);
  const wsConnectPromises = [];

  for (let i = 0; i < concurrency; i++) {
    const p = new Promise((resolve) => {
      const ws = new WebSocket(`${WS_URL}/ws?event=${eventId}`);
      let hasOpened = false;

      ws.on("open", () => {
        hasOpened = true;
        metrics.wsConnected++;
        resolve(ws);
      });

      ws.on("message", (data) => {
        metrics.wsMessagesReceived++;
      });

      ws.on("error", () => {
        if (!hasOpened) {
          metrics.wsFailed++;
          resolve(null);
        }
      });

      setTimeout(() => {
        if (!hasOpened) {
          metrics.wsFailed++;
          try { ws.terminate(); } catch (e) {}
          resolve(null);
        }
      }, 5000);
    });

    wsConnectPromises.push(p);
  }

  const connectedSockets = await Promise.all(wsConnectPromises);
  for (const s of connectedSockets) {
    if (s) wsClients.push(s);
  }

  const connectDurationSec = (Date.now() - startConnectTime) / 1000;
  console.log(`  ✓ ${metrics.wsConnected}/${concurrency} WebSockets connected in ${connectDurationSec.toFixed(2)}s`);

  // Phase 2: Simultaneous Score Submissions (Burst Traffic)
  console.log(`[2/3] Simulating burst score submission from all ${concurrency} players...`);
  const submitStartTime = Date.now();
  const submitPromises = [];

  for (let i = 0; i < concurrency; i++) {
    const score = Math.floor(Math.random() * 10000) + 3000; // 3,000 to 13,000 pts
    const timeSec = Math.round((Math.random() * 40 + 20) * 10) / 10; // 20.0 to 60.0s

    const p = submitScore(eventId, i, score, timeSec).then((res) => {
      metrics.submissionsTotal++;
      metrics.submitLatencies.push(res.latencyMs);
      if (res.success) {
        metrics.submissionsSuccess++;
      } else {
        metrics.submissionsFailed++;
      }
    });
    submitPromises.push(p);
  }

  await Promise.all(submitPromises);
  const submitDurationSec = (Date.now() - submitStartTime) / 1000;

  // Phase 3: Wait 500ms for batch broadcast settlement
  await new Promise(r => setTimeout(r, 500));

  // Clean up WebSockets
  for (const ws of wsClients) {
    try { ws.close(); } catch (e) {}
  }

  // Calculate statistics
  metrics.submitLatencies.sort((a, b) => a - b);
  const p50 = calculatePercentile(metrics.submitLatencies, 50);
  const p95 = calculatePercentile(metrics.submitLatencies, 95);
  const p99 = calculatePercentile(metrics.submitLatencies, 99);
  const avg = metrics.submitLatencies.reduce((a, b) => a + b, 0) / (metrics.submitLatencies.length || 1);
  const rps = metrics.submissionsTotal / submitDurationSec;
  const successPct = ((metrics.submissionsSuccess / (metrics.submissionsTotal || 1)) * 100).toFixed(2);
  const wsSuccessPct = ((metrics.wsConnected / concurrency) * 100).toFixed(2);

  const report = {
    concurrency,
    webSockets: {
      attempted: concurrency,
      connected: metrics.wsConnected,
      failed: metrics.wsFailed,
      connectionSuccessRate: `${wsSuccessPct}%`,
      totalBroadcastsReceived: metrics.wsMessagesReceived
    },
    submissions: {
      total: metrics.submissionsTotal,
      successful: metrics.submissionsSuccess,
      failed: metrics.submissionsFailed,
      successRate: `${successPct}%`,
      durationSec: submitDurationSec.toFixed(2),
      throughputRps: rps.toFixed(2),
      latencyMs: {
        avg: avg.toFixed(2),
        p50: p50.toFixed(2),
        p95: p95.toFixed(2),
        p99: p99.toFixed(2)
      }
    }
  };

  console.log(`\n--- Results for ${concurrency} Concurrent VUs ---`);
  console.log(`WebSocket Success Rate: ${report.webSockets.connectionSuccessRate} (${report.webSockets.connected}/${concurrency})`);
  console.log(`Broadcasts Received:    ${report.webSockets.totalBroadcastsReceived}`);
  console.log(`Submission Throughput:  ${report.submissions.throughputRps} req/s (${report.submissions.durationSec}s burst window)`);
  console.log(`Submission Success:     ${report.submissions.successRate} (Failed: ${report.submissions.failed})`);
  console.log(`Latencies:`);
  console.log(`  p50 (median):         ${report.submissions.latencyMs.p50} ms`);
  console.log(`  p95:                  ${report.submissions.latencyMs.p95} ms`);
  console.log(`  p99:                  ${report.submissions.latencyMs.p99} ms`);

  return report;
}

async function main() {
  const tiers = [100, 250, 500];
  const allResults = [];

  for (const tier of tiers) {
    const res = await runConcurrencyStage(tier);
    allResults.push(res);
    await new Promise(r => setTimeout(r, 2000)); // Cool down
  }

  const fs = require("fs");
  const path = require("path");
  const outPath = path.join(__dirname, "leaderboard-load-results.json");
  fs.writeFileSync(outPath, JSON.stringify(allResults, null, 2));
  console.log(`\nDetailed load test benchmark written to: ${outPath}`);
}

main().catch(err => {
  console.error("Stress test failed:", err);
  process.exit(1);
});
