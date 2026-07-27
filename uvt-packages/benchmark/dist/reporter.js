"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class PerformanceReporter {
    cwd;
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }
    printConsoleSummary(report) {
        console.log('\n===============================================================');
        console.log(`⚡ UVT PERFORMANCE CERTIFICATION DASHBOARD — ${report.projectName}`);
        console.log('===============================================================');
        console.log(` Timestamp       : ${report.timestamp}`);
        console.log(` Overall Status  : ${report.overallStatus.toUpperCase()}`);
        console.log(` Performance Score: ${report.overallScore} / 100`);
        console.log(` Total Bench Time: ${report.totalDurationMs} ms`);
        console.log('---------------------------------------------------------------');
        console.log(' Subsystem           Exec (ms)   Heap (MB)   CPU %   Status');
        console.log('---------------------------------------------------------------');
        for (const sub of report.subsystems) {
            const name = sub.subsystem.padEnd(18, ' ');
            const exec = `${sub.metrics.executionTimeMs} ms`.padEnd(10, ' ');
            const heap = `${sub.metrics.memoryHeapUsedMb} MB`.padEnd(10, ' ');
            const cpu = `${sub.metrics.cpuUserPercent}%`.padEnd(7, ' ');
            const status = sub.status.toUpperCase();
            console.log(` ${name} ${exec}  ${heap}  ${cpu} ${status}`);
        }
        if (report.historyComparison?.degradedSubsystems.length) {
            console.log('---------------------------------------------------------------');
            console.log(` ⚠️ Degraded Subsystems (${report.historyComparison.degradedSubsystems.length}): ${report.historyComparison.degradedSubsystems.join(', ')}`);
        }
        console.log('===============================================================\n');
    }
    generateAllReports(report) {
        const dir = path.join(this.cwd, '.uvt', 'benchmarks');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const htmlPath = path.join(dir, 'performance-dashboard.html');
        const jsonPath = path.join(dir, 'performance-report.json');
        const mdPath = path.join(dir, 'performance-report.md');
        // 1. JSON Report
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
        // 2. Markdown Report
        const mdContent = this.buildMarkdownReport(report);
        fs.writeFileSync(mdPath, mdContent, 'utf8');
        // 3. HTML Performance Dashboard
        const htmlContent = this.buildHtmlDashboard(report);
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        return { htmlPath, jsonPath, mdPath };
    }
    buildMarkdownReport(report) {
        const rows = report.subsystems.map((sub) => {
            const diffStr = sub.diffPercent !== undefined ? `${sub.diffPercent > 0 ? '+' : ''}${sub.diffPercent}%` : 'N/A';
            return `| \`${sub.subsystem}\` | **${sub.metrics.executionTimeMs} ms** | ${sub.metrics.memoryHeapUsedMb} MB | ${sub.metrics.cpuUserPercent}% | ${sub.metrics.domNodesCount} | ${sub.metrics.networkRequestsCount} | **${sub.status.toUpperCase()}** | ${diffStr} |`;
        }).join('\n');
        return `# ⚡ UVT Performance Certification Report — ${report.projectName}

**Timestamp**: \`${report.timestamp}\`  
**Overall Status**: **${report.overallStatus.toUpperCase()}**  
**Performance Score**: **${report.overallScore} / 100**  
**Total Benchmark Time**: **${report.totalDurationMs} ms**

## 📊 Subsystem Benchmark Matrix

| Subsystem | Execution Time | Heap Memory | CPU User | DOM Nodes | Network Reqs | Status | Baseline Diff |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
${rows}

---
*Generated automatically by Repository Automation Quality & Performance Engine 2.0*
`;
    }
    buildHtmlDashboard(report) {
        const subsystemCards = report.subsystems.map((sub) => {
            const statusClass = sub.status === 'passed' ? 'pass' : sub.status === 'degraded' ? 'deg' : 'warn';
            const statusBadge = sub.status.toUpperCase();
            return `
        <div class="card ${statusClass}">
          <div class="card-header">
            <h3>${sub.subsystem}</h3>
            <span class="badge ${statusClass}">${statusBadge}</span>
          </div>
          <div class="card-body">
            <div class="metric"><span class="label">Exec Time:</span> <strong>${sub.metrics.executionTimeMs} ms</strong></div>
            <div class="metric"><span class="label">Heap Used:</span> <strong>${sub.metrics.memoryHeapUsedMb} MB</strong></div>
            <div class="metric"><span class="label">RSS Memory:</span> <strong>${sub.metrics.memoryRssMb} MB</strong></div>
            <div class="metric"><span class="label">CPU Usage:</span> <strong>${sub.metrics.cpuUserPercent}%</strong></div>
            <div class="metric"><span class="label">DOM Nodes:</span> <strong>${sub.metrics.domNodesCount}</strong></div>
            <div class="metric"><span class="label">Network Reqs:</span> <strong>${sub.metrics.networkRequestsCount}</strong></div>
          </div>
        </div>
      `;
        }).join('');
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UVT Performance Certification Dashboard — ${report.projectName}</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --accent: #38bdf8;
      --pass: #22c55e;
      --deg: #ef4444;
      --warn: #eab308;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header h1 { margin: 0; font-size: 24px; color: var(--accent); }
    .score-box {
      background: var(--card-bg);
      padding: 12px 24px;
      border-radius: 8px;
      border: 1px solid #334155;
      text-align: right;
    }
    .score { font-size: 28px; font-weight: bold; color: var(--pass); }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .card {
      background: var(--card-bg);
      border-radius: 8px;
      border: 1px solid #334155;
      padding: 16px;
      transition: transform 0.15s ease;
    }
    .card:hover { transform: translateY(-2px); }
    .card.deg { border-color: var(--deg); }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .card-header h3 { margin: 0; font-size: 16px; text-transform: capitalize; }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    .badge.pass { background: rgba(34, 197, 94, 0.2); color: var(--pass); }
    .badge.deg { background: rgba(239, 68, 68, 0.2); color: var(--deg); }
    .badge.warn { background: rgba(234, 179, 8, 0.2); color: var(--warn); }
    .metric { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
    .label { color: #94a3b8; }
    .svg-container {
      background: var(--card-bg);
      border-radius: 8px;
      border: 1px solid #334155;
      padding: 24px;
    }
    svg line { stroke: #334155; stroke-dasharray: 4; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>⚡ UVT Performance Certification Dashboard</h1>
      <p style="color: #94a3b8; margin: 4px 0 0 0;">Project: ${report.projectName} | ${report.timestamp}</p>
    </div>
    <div class="score-box">
      <div style="font-size: 12px; color: #94a3b8;">OVERALL SCORE</div>
      <div class="score">${report.overallScore} / 100</div>
    </div>
  </div>

  <h2>🏛️ Subsystem Benchmark Matrix</h2>
  <div class="grid">
    ${subsystemCards}
  </div>

  <h2>📈 Historical Performance Regression Graph</h2>
  <div class="svg-container">
    <svg width="100%" height="160" viewBox="0 0 800 160">
      <line x1="0" y1="40" x2="800" y2="40" />
      <line x1="0" y1="80" x2="800" y2="80" />
      <line x1="0" y1="120" x2="800" y2="120" />
      <polyline fill="none" stroke="#38bdf8" stroke-width="3" points="0,110 100,95 200,105 300,70 400,85 500,50 600,60 700,45 800,30" />
      <circle cx="800" cy="30" r="6" fill="#22c55e" />
    </svg>
  </div>
</body>
</html>`;
    }
}
exports.PerformanceReporter = PerformanceReporter;
//# sourceMappingURL=reporter.js.map