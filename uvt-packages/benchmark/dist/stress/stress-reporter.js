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
exports.StressTestReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class StressTestReporter {
    cwd;
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }
    printConsoleSummary(report) {
        console.log('\n===================================================================');
        console.log(`💥 UVT EXTREME STRESS TESTING BENCHMARK DASHBOARD — RC-12`);
        console.log('===================================================================');
        console.log(` Timestamp       : ${report.timestamp}`);
        console.log(` Master Score    : ${report.overallScore} / 100`);
        console.log(` Overall Status  : ${report.overallStatus}`);
        console.log(` Total Scenarios : ${report.totalScenarios}`);
        console.log('-------------------------------------------------------------------');
        console.log(' Scenario                      Routes   Comps   Analysis   Status');
        console.log('-------------------------------------------------------------------');
        for (const sc of report.scenarios) {
            const name = sc.name.padEnd(30, ' ');
            const routes = `${sc.metrics.routeCount}`.padEnd(8, ' ');
            const comps = `${sc.metrics.componentCount}`.padEnd(7, ' ');
            const time = `${sc.metrics.analysisTimeMs}ms`.padEnd(10, ' ');
            const status = sc.status;
            console.log(` ${name} ${routes} ${comps} ${time} ${status}`);
        }
        console.log('===================================================================\n');
    }
    generateAllReports(report) {
        const dir = path.join(this.cwd, '.uvt', 'stress');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const htmlPath = path.join(dir, 'stress-dashboard.html');
        const jsonPath = path.join(dir, 'stress-report.json');
        const mdPath = path.join(dir, 'stress-report.md');
        // 1. JSON Report
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
        // 2. Markdown Report
        fs.writeFileSync(mdPath, this.buildMarkdownReport(report), 'utf8');
        // 3. Interactive HTML Dashboard
        fs.writeFileSync(htmlPath, this.buildHtmlDashboard(report), 'utf8');
        return { htmlPath, jsonPath, mdPath };
    }
    buildMarkdownReport(report) {
        const rows = report.scenarios.map((sc) => {
            return `| **${sc.name}** | ${sc.metrics.routeCount} | ${sc.metrics.componentCount} | **${sc.metrics.analysisTimeMs} ms** | ${sc.metrics.memoryHeapUsedMb} MB | ${sc.metrics.generatorSpeedSpecsPerSec} specs/s | **${sc.status}** |`;
        }).join('\n');
        return `# 💥 UVT Extreme Stress Testing Report (RC-12)

**Timestamp**: \`${report.timestamp}\`  
**Overall Scalability Status**: **${report.overallStatus}**  
**Overall Stress Score**: **${report.overallScore} / 100**  
**Total Evaluated Scale Scenarios**: **${report.totalScenarios}**

## 📊 Scale Performance Matrix

| Scenario Name | Routes | Components | Analysis Time | Heap Used | Generator Speed | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
${rows}

---
*Generated automatically by Universal Visual Testing Tool — Automated Stress Testing Framework 2.0*
`;
    }
    buildHtmlDashboard(report) {
        const cards = report.scenarios.map((sc) => {
            const badgeClass = sc.status === 'PASSED' ? 'pass' : sc.status === 'DEGRADED' ? 'deg' : 'fail';
            return `
        <div class="card">
          <div class="card-header">
            <h3>${sc.name}</h3>
            <span class="badge ${badgeClass}">${sc.status}</span>
          </div>
          <div class="card-body">
            <div class="row"><span>Routes:</span> <strong>${sc.metrics.routeCount}</strong></div>
            <div class="row"><span>Components:</span> <strong>${sc.metrics.componentCount}</strong></div>
            <div class="row"><span>Analysis Time:</span> <strong>${sc.metrics.analysisTimeMs} ms</strong></div>
            <div class="row"><span>Heap Memory:</span> <strong>${sc.metrics.memoryHeapUsedMb} MB</strong></div>
            <div class="row"><span>Generator Speed:</span> <strong>${sc.metrics.generatorSpeedSpecsPerSec} specs/s</strong></div>
            <div class="row"><span>Snapshot Processing Rate:</span> <strong>${sc.metrics.snapshotProcessingRatePerSec} snaps/s</strong></div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">${sc.description}</p>
          </div>
        </div>
      `;
        }).join('');
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UVT Extreme Stress Testing Dashboard — RC-12</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --accent: #38bdf8;
      --pass: #22c55e;
      --deg: #eab308;
      --fail: #ef4444;
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
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .card {
      background: var(--card-bg);
      border-radius: 8px;
      border: 1px solid #334155;
      padding: 16px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .card-header h3 { margin: 0; font-size: 15px; color: #f8fafc; }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    .badge.pass { background: rgba(34, 197, 94, 0.2); color: var(--pass); }
    .badge.deg { background: rgba(234, 179, 8, 0.2); color: var(--deg); }
    .badge.fail { background: rgba(239, 68, 68, 0.2); color: var(--fail); }
    .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; color: #94a3b8; }
    .row strong { color: #f8fafc; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>💥 UVT Extreme Stress Testing Dashboard</h1>
      <p style="color: #94a3b8; margin: 4px 0 0 0;">Project: ${report.projectName} | ${report.timestamp} | Status: ${report.overallStatus}</p>
    </div>
    <div class="score-box">
      <div style="font-size: 12px; color: #94a3b8;">STRESS SCALABILITY SCORE</div>
      <div class="score">${report.overallScore} / 100</div>
    </div>
  </div>

  <h2>🏛️ Extreme Scale Benchmark Scenarios (7 Scenarios)</h2>
  <div class="grid">
    ${cards}
  </div>
</body>
</html>`;
    }
}
exports.StressTestReporter = StressTestReporter;
//# sourceMappingURL=stress-reporter.js.map