/**
 * Bible Quiz Game - Load Testing Suite
 * Simulates high-traffic access scenarios:
 * Level 1: 100 concurrent virtual users
 * Level 2: 250 concurrent virtual users
 * Level 3: 500 concurrent virtual users
 * 
 * Simulates real user browser sessions downloading the core web payload:
 * - HTML document (/index.html)
 * - CSS stylesheet (/style.css?v=2.1.0)
 * - Main application logic (/script.js?v=2.1.0)
 * - Brand asset (/logo.avif)
 */

const http = require('http');

const TARGET_HOST = process.env.TEST_HOST || '127.0.0.1';
const TARGET_PORT = parseInt(process.env.TEST_PORT || '3000', 10);

const ASSET_PATHS = [
  '/',
  '/style.css?v=2.1.0',
  '/script.js?v=2.1.0',
  '/logo.avif'
];

function fetchAsset(path) {
  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    const req = http.get(
      {
        hostname: TARGET_HOST,
        port: TARGET_PORT,
        path: path,
        agent: false,
        headers: {
          'User-Agent': 'BibleQuiz-LoadTest/1.0',
          'Accept': '*/*',
          'Connection': 'close'
        }
      },
      (res) => {
        let bytes = 0;
        res.on('data', (chunk) => {
          bytes += chunk.length;
        });
        res.on('end', () => {
          const endTime = process.hrtime.bigint();
          const durationMs = Number(endTime - startTime) / 1e6;
          resolve({
            statusCode: res.statusCode,
            durationMs,
            bytes,
            error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : null
          });
        });
      }
    );

    req.on('error', (err) => {
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1e6;
      resolve({
        statusCode: 0,
        durationMs,
        bytes: 0,
        error: err.message
      });
    });

    req.setTimeout(15000, () => {
      req.destroy(new Error('Request Timeout'));
    });
  });
}

async function simulateVirtualUser(vuId, durationSeconds, metrics) {
  const endTime = Date.now() + durationSeconds * 1000;

  while (Date.now() < endTime) {
    // Each user loads the initial static bundle
    for (const path of ASSET_PATHS) {
      const result = await fetchAsset(path);
      metrics.latencies.push(result.durationMs);
      metrics.totalBytes += result.bytes;
      metrics.totalRequests++;

      if (result.error) {
        metrics.errors++;
        metrics.errorDetails.set(result.error, (metrics.errorDetails.get(result.error) || 0) + 1);
      } else {
        metrics.successes++;
      }
    }
    // Realistic browser pacing: wait 100-300ms before reading / taking next interaction
    await new Promise((r) => setTimeout(r, Math.random() * 200 + 100));
  }
}

function calculatePercentile(sortedArray, percentile) {
  if (sortedArray.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
  return sortedArray[Math.min(index, sortedArray.length - 1)];
}

async function runStage(concurrency, durationSec) {
  console.log(`\n======================================================`);
  console.log(`Starting Load Test: ${concurrency} Concurrent Virtual Users (${durationSec}s run)`);
  console.log(`Target: http://${TARGET_HOST}:${TARGET_PORT}`);
  console.log(`Assets per Session: ${ASSET_PATHS.join(', ')}`);
  console.log(`======================================================`);

  const metrics = {
    totalRequests: 0,
    successes: 0,
    errors: 0,
    totalBytes: 0,
    latencies: [],
    errorDetails: new Map()
  };

  const startTime = Date.now();
  const vuPromises = [];

  for (let i = 0; i < concurrency; i++) {
    vuPromises.push(simulateVirtualUser(i, durationSec, metrics));
  }

  await Promise.all(vuPromises);
  const wallClockSec = (Date.now() - startTime) / 1000;

  metrics.latencies.sort((a, b) => a - b);
  const p50 = calculatePercentile(metrics.latencies, 50);
  const p95 = calculatePercentile(metrics.latencies, 95);
  const p99 = calculatePercentile(metrics.latencies, 99);
  const avg = metrics.latencies.reduce((a, b) => a + b, 0) / (metrics.latencies.length || 1);
  const rps = metrics.totalRequests / wallClockSec;
  const mbTransferred = metrics.totalBytes / (1024 * 1024);
  const mbPerSec = mbTransferred / wallClockSec;
  const successRate = ((metrics.successes / (metrics.totalRequests || 1)) * 100).toFixed(2);

  const report = {
    concurrency,
    durationSec: wallClockSec.toFixed(2),
    totalRequests: metrics.totalRequests,
    successfulRequests: metrics.successes,
    failedRequests: metrics.errors,
    successRate: `${successRate}%`,
    rps: rps.toFixed(2),
    dataTransferredMB: mbTransferred.toFixed(2),
    bandwidthMBps: mbPerSec.toFixed(2),
    latencyMs: {
      avg: avg.toFixed(2),
      p50: p50.toFixed(2),
      p95: p95.toFixed(2),
      p99: p99.toFixed(2)
    },
    errors: Object.fromEntries(metrics.errorDetails)
  };

  console.log(`\n--- Results for ${concurrency} VUs ---`);
  console.log(`Total Requests:      ${report.totalRequests}`);
  console.log(`Success Rate:        ${report.successRate}`);
  console.log(`HTTP Errors:         ${report.failedRequests}`);
  console.log(`Throughput:          ${report.rps} req/sec`);
  console.log(`Data Transferred:    ${report.dataTransferredMB} MB (${report.bandwidthMBps} MB/s)`);
  console.log(`Latencies:`);
  console.log(`  Average:           ${report.latencyMs.avg} ms`);
  console.log(`  p50 (median):      ${report.latencyMs.p50} ms`);
  console.log(`  p95:               ${report.latencyMs.p95} ms`);
  console.log(`  p99:               ${report.latencyMs.p99} ms`);
  if (metrics.errors > 0) {
    console.log(`Error Breakdown:`, report.errors);
  }

  return report;
}

async function main() {
  const levels = [100, 250, 500];
  const durationSec = 10;
  const allResults = [];

  for (const level of levels) {
    const res = await runStage(level, durationSec);
    allResults.push(res);
    // Cool down for 3 seconds between levels
    await new Promise((r) => setTimeout(r, 3000));
  }

  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, 'load-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  console.log(`\nDetailed load test output written to ${reportPath}`);
}

main().catch((err) => {
  console.error("Load test failed:", err);
  process.exit(1);
});
