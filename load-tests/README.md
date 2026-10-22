# Bible Quiz Game — High-Traffic Load Testing Suite

This directory contains automated, reproducible load testing scripts designed to evaluate the concurrency and throughput capacity of the Bible Quiz Game under peak gathering conditions (100, 250, and 500 concurrent virtual users).

---

## 1. Test Architecture Overview

- **Application Type**: 100% Client-Side Static Single Page Application (HTML5, CSS3, Vanilla JS).
- **Runtime APIs**: 0 server-side API requests during gameplay.
- **Payload per Client**:
  - `index.html` (~28 KB uncompressed / ~7 KB gzip)
  - `style.css?v=2.1.0` (~40 KB uncompressed / ~9 KB gzip)
  - `script.js?v=2.1.0` (~92 KB uncompressed / ~24 KB gzip)
  - `logo.avif` (~51 KB image asset)
  - **Total Initial Download**: ~210 KB uncompressed (approx. 65 KB compressed).
- **Concurrency Pattern**: Virtual users arrive, download all essential assets concurrently, and simulate user interactions with randomized pacing intervals (100–300ms).

---

## 2. Prerequisites

- [Node.js](https://nodejs.org/) v18+ (verified on Node.js v22.19.0).
- No external npm packages required (uses pure built-in `http`, `fs`, `path`, and `process.hrtime.bigint`).

---

## 3. How to Run the Load Tests Locally

### Step 1: Start the Local Staging Server
Open a terminal in the root project folder:
```powershell
node -e "
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.json': 'application/json'
};
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});
server.listen(PORT, () => console.log('Staging server running at http://localhost:' + PORT));
"
```

### Step 2: Execute the Load Test
In another terminal (or background process):
```powershell
node load-tests/load-test.js
```

To target a custom host/port:
```powershell
$env:TEST_HOST="127.0.0.1"; $env:TEST_PORT="3000"; node load-tests/load-test.js
```

---

## 4. Benchmark Results Summary

Executed on Windows host (Node.js v22.19.0, 10s per concurrency tier):

| Metric | 100 Virtual Users | 250 Virtual Users | 500 Virtual Users |
| :--- | :---: | :---: | :---: |
| **Total Requests** | 18,276 | 29,852 | 20,644 |
| **Success Rate** | **100.00%** | **100.00%** | **100.00%** |
| **HTTP Errors** | **0** | **0** | **0** |
| **Throughput (RPS)** | 1,775.06 req/s | 2,886.20 req/s | 1,918.77 req/s |
| **Data Transferred** | 919.80 MB | 1,502.41 MB | 1,038.98 MB |
| **Average Latency** | 5.21 ms | 32.93 ms | 197.06 ms |
| **p50 (Median Latency)** | 3.02 ms | 28.67 ms | 200.00 ms |
| **p95 Latency** | 14.47 ms | 74.93 ms | 293.25 ms |
| **p99 Latency** | 59.25 ms | 119.08 ms | 341.00 ms |

Detailed JSON output is automatically saved to [`load-tests/load-test-results.json`](file:///e:/BIBLE-QUIZ-CHALLENGE/load-tests/load-test-results.json).
