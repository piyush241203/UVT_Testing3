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
exports.UnifiedRegressionReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class UnifiedRegressionReporter {
    cwd;
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }
    printConsoleSummary(report) {
        console.log('\n===================================================================');
        console.log(`🛡️  UVT MASTER UNIFIED REGRESSION DASHBOARD — ${report.projectName}`);
        console.log('===================================================================');
        console.log(` Timestamp       : ${report.timestamp}`);
        console.log(` System Health   : ${report.overallHealth}`);
        console.log(` Master Score    : ${report.overallScore} / 100`);
        console.log(` Passes / Fails  : ${report.totalPasses} Passed | ${report.totalFails} Failed | ${report.totalWarnings} Warnings`);
        console.log(` Pass Rate       : ${report.passRatePercent}%`);
        console.log('-------------------------------------------------------------------');
        console.log(' Subsystem Certification               Score    Passes   Status');
        console.log('-------------------------------------------------------------------');
        for (const sub of report.subsystems) {
            const name = sub.name.padEnd(35, ' ');
            const score = `${sub.score}%`.padEnd(8, ' ');
            const passes = `${sub.passCount}`.padEnd(8, ' ');
            const status = sub.status;
            console.log(` ${name} ${score} ${passes} ${status}`);
        }
        console.log('===================================================================\n');
    }
    generateAllReports(report) {
        const dir = path.join(this.cwd, '.uvt', 'dashboard');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const htmlPath = path.join(dir, 'unified-dashboard.html');
        const jsonPath = path.join(dir, 'unified-report.json');
        const mdPath = path.join(dir, 'unified-report.md');
        const csvPath = path.join(dir, 'unified-report.csv');
        // 1. JSON Export
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
        // 2. Markdown Export
        fs.writeFileSync(mdPath, this.buildMarkdownReport(report), 'utf8');
        // 3. CSV Export
        fs.writeFileSync(csvPath, this.buildCsvReport(report), 'utf8');
        // 4. HTML Unified Dashboard
        fs.writeFileSync(htmlPath, this.buildHtmlDashboard(report), 'utf8');
        return { htmlPath, jsonPath, mdPath, csvPath };
    }
    buildCsvReport(report) {
        const header = 'SubsystemID,SubsystemName,Score,Status,PassCount,FailCount,WarningCount,Details\n';
        const rows = report.subsystems.map((sub) => {
            const escapedDetails = `"${sub.details.replace(/"/g, '""')}"`;
            return `${sub.id},"${sub.name}",${sub.score},${sub.status},${sub.passCount},${sub.failCount},${sub.warningCount},${escapedDetails}`;
        }).join('\n');
        return header + rows + '\n';
    }
    buildMarkdownReport(report) {
        const rows = report.subsystems.map((sub) => {
            return `| **${sub.name}** | **${sub.score}%** | ${sub.passCount} | ${sub.failCount} | ${sub.warningCount} | **${sub.status}** | ${sub.details} |`;
        }).join('\n');
        return `# 🛡️ UVT Master Unified Regression Dashboard — ${report.projectName}

**Timestamp**: \`${report.timestamp}\`  
**System Health**: **${report.overallHealth}**  
**Master Score**: **${report.overallScore} / 100**  
**Total Pass Count**: **${report.totalPasses}** | **Fails**: **${report.totalFails}** | **Warnings**: **${report.totalWarnings}**  
**Pass Rate**: **${report.passRatePercent}%**

## 🏛️ Subsystem Certification Breakdown (10 Subsystems)

| Certification Subsystem | Score | Pass Count | Fail Count | Warnings | Status | Verification Details |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
${rows}

---
*Generated automatically by Universal Visual Testing Tool — Master Unified Regression Engine 2.0*
`;
    }
    buildHtmlDashboard(report) {
        const cards = report.subsystems.map((sub) => {
            const badgeClass = sub.status === 'PASS' ? 'pass' : sub.status === 'FAIL' ? 'fail' : 'warn';
            return `
        <div class="card">
          <div class="card-header">
            <h3>${sub.name}</h3>
            <span class="badge ${badgeClass}">${sub.status}</span>
          </div>
          <div class="card-body">
            <div class="score-display">${sub.score}%</div>
            <div class="row"><span>Passes:</span> <strong style="color: #22c55e;">${sub.passCount}</strong></div>
            <div class="row"><span>Fails:</span> <strong style="color: #ef4444;">${sub.failCount}</strong></div>
            <div class="row"><span>Warnings:</span> <strong style="color: #eab308;">${sub.warningCount}</strong></div>
            <p class="details">${sub.details}</p>
          </div>
        </div>
      `;
        }).join('');
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UVT Master Unified Regression Dashboard — ${report.projectName}</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --accent: #38bdf8;
      --pass: #22c55e;
      --fail: #ef4444;
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
    .score-display { font-size: 22px; font-weight: bold; color: var(--accent); margin-bottom: 8px; }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    .badge.pass { background: rgba(34, 197, 94, 0.2); color: var(--pass); }
    .badge.fail { background: rgba(239, 68, 68, 0.2); color: var(--fail); }
    .badge.warn { background: rgba(234, 179, 8, 0.2); color: var(--warn); }
    .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; color: #94a3b8; }
    .details { font-size: 12px; color: #cbd5e1; margin-top: 8px; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>🛡️ UVT Master Unified Regression Dashboard</h1>
      <p style="color: #94a3b8; margin: 4px 0 0 0;">Project: ${report.projectName} | ${report.timestamp} | Health: ${report.overallHealth}</p>
    </div>
    <div class="score-box">
      <div style="font-size: 12px; color: #94a3b8;">MASTER QUALITY SCORE</div>
      <div class="score">${report.overallScore} / 100</div>
    </div>
  </div>

  <h2>🏛️ 10 Certification Subsystems Overview</h2>
  <div class="grid">
    ${cards}
  </div>
</body>
</html>`;
    }
}
exports.UnifiedRegressionReporter = UnifiedRegressionReporter;
//# sourceMappingURL=unified-reporter.js.map