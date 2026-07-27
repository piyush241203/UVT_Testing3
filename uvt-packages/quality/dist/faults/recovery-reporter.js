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
exports.FailureRecoveryReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FailureRecoveryReporter {
    cwd;
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }
    printConsoleSummary(report) {
        console.log('\n===================================================================');
        console.log(`🛠️  UVT FAILURE INJECTION & SELF-HEALING RECOVERY DASHBOARD — RC-13`);
        console.log('===================================================================');
        console.log(` Timestamp       : ${report.timestamp}`);
        console.log(` Self-Healing    : ${report.selfHealingScore}% (${report.autoRepairedCount} / ${report.totalFaultsInjected} Auto-Repaired)`);
        console.log(` Status          : ${report.overallStatus}`);
        console.log(` Manual Fixes    : ${report.manualInterventionCount} Required`);
        console.log('-------------------------------------------------------------------');
        console.log(' Fault Scenario                Detect   Repair   Intervention   Status');
        console.log('-------------------------------------------------------------------');
        for (const sc of report.scenarios) {
            const name = sc.name.padEnd(28, ' ');
            const detect = `${sc.detectionTimeMs}ms`.padEnd(8, ' ');
            const repair = `${sc.repairTimeMs}ms`.padEnd(8, ' ');
            const manual = sc.manualInterventionRequired ? 'YES' : 'NO';
            const manualPad = manual.padEnd(14, ' ');
            const status = sc.status;
            console.log(` ${name} ${detect} ${repair} ${manualPad} ${status}`);
        }
        console.log('===================================================================\n');
    }
    generateAllReports(report) {
        const dir = path.join(this.cwd, '.uvt', 'faults');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const htmlPath = path.join(dir, 'recovery-dashboard.html');
        const jsonPath = path.join(dir, 'recovery-report.json');
        const mdPath = path.join(dir, 'recovery-report.md');
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
            return `| **${sc.name}** | ${sc.detectionTimeMs} ms | ${sc.repairTimeMs} ms | ${sc.manualInterventionRequired ? '⚠️ YES' : '✅ NO'} | **${sc.status}** | ${sc.repairDetails} |`;
        }).join('\n');
        return `# 🛠️ UVT Failure Injection & Self-Healing Report (RC-13)

**Timestamp**: \`${report.timestamp}\`  
**Overall Self-Healing Status**: **${report.overallStatus}**  
**Self-Healing Score**: **${report.selfHealingScore}%**  
**Total Injected Faults**: **${report.totalFaultsInjected}** | **Auto-Repaired**: **${report.autoRepairedCount}** | **Manual Fixes**: **${report.manualInterventionCount}**

## 📊 Self-Healing Fault Recovery Matrix

| Fault Scenario Name | Detection Time | Repair Time | Manual Fix Needed | Repair Status | Self-Healing Details |
| :--- | :---: | :---: | :---: | :---: | :--- |
${rows}

---
*Generated automatically by Universal Visual Testing Tool — Failure Injection & Self-Healing Framework 2.0*
`;
    }
    buildHtmlDashboard(report) {
        const cards = report.scenarios.map((sc) => {
            const badgeClass = sc.status === 'AUTO_REPAIRED' ? 'pass' : sc.status === 'HEALED_WITH_FALLBACK' ? 'warn' : 'fail';
            return `
        <div class="card">
          <div class="card-header">
            <h3>${sc.name}</h3>
            <span class="badge ${badgeClass}">${sc.status}</span>
          </div>
          <div class="card-body">
            <div class="row"><span>Detection Time:</span> <strong>${sc.detectionTimeMs} ms</strong></div>
            <div class="row"><span>Repair Time:</span> <strong>${sc.repairTimeMs} ms</strong></div>
            <div class="row"><span>Manual Intervention:</span> <strong style="color: ${sc.manualInterventionRequired ? '#ef4444' : '#22c55e'};">${sc.manualInterventionRequired ? 'REQUIRED' : 'NONE REQUIRED'}</strong></div>
            <p class="details">${sc.repairDetails}</p>
          </div>
        </div>
      `;
        }).join('');
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UVT Failure Injection & Self-Healing Dashboard — RC-13</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --accent: #38bdf8;
      --pass: #22c55e;
      --warn: #eab308;
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
    .badge.warn { background: rgba(234, 179, 8, 0.2); color: var(--warn); }
    .badge.fail { background: rgba(239, 68, 68, 0.2); color: var(--fail); }
    .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; color: #94a3b8; }
    .row strong { color: #f8fafc; }
    .details { font-size: 12px; color: #cbd5e1; margin-top: 8px; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>🛠️ UVT Failure Injection & Self-Healing Dashboard</h1>
      <p style="color: #94a3b8; margin: 4px 0 0 0;">Project: ${report.projectName} | ${report.timestamp} | Status: ${report.overallStatus}</p>
    </div>
    <div class="score-box">
      <div style="font-size: 12px; color: #94a3b8;">SELF-HEALING SCORE</div>
      <div class="score">${report.selfHealingScore}%</div>
    </div>
  </div>

  <h2>🏛️ Injected Fault Scenarios (9 Fault Scenarios)</h2>
  <div class="grid">
    ${cards}
  </div>
</body>
</html>`;
    }
}
exports.FailureRecoveryReporter = FailureRecoveryReporter;
//# sourceMappingURL=recovery-reporter.js.map