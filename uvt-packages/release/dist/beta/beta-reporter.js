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
exports.BetaCertifierReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class BetaCertifierReporter {
    cwd;
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }
    printConsoleSummary(report) {
        console.log('\n===================================================================');
        console.log(`🚀 UVT OFFICIAL PUBLIC BETA CERTIFICATION DASHBOARD — RC-14`);
        console.log('===================================================================');
        console.log(` Timestamp       : ${report.timestamp}`);
        console.log(` Final Decision  : ${report.decision}`);
        console.log(` Readiness Score : ${report.readinessScore} / 100`);
        console.log(` Suite Results   : ${report.passedSuitesCount} / ${report.totalSuitesVerified} Suites Passed 100%`);
        console.log('-------------------------------------------------------------------');
        console.log(' Certification Suite                   Score    Status   Result');
        console.log('-------------------------------------------------------------------');
        for (const sc of report.suites) {
            const name = sc.name.padEnd(35, ' ');
            const score = `${sc.score}%`.padEnd(8, ' ');
            const status = sc.passed ? 'PASSED' : 'FAILED';
            const statusPad = status.padEnd(8, ' ');
            const result = sc.passed ? '✔ CERTIFIED' : '❌ BLOCKED';
            console.log(` ${name} ${score} ${statusPad} ${result}`);
        }
        console.log('===================================================================\n');
    }
    generateAllReports(report) {
        const dir = path.join(this.cwd, '.uvt', 'beta');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const htmlPath = path.join(dir, 'beta-readiness-report.html');
        const jsonPath = path.join(dir, 'beta-readiness-report.json');
        const mdPath = path.join(dir, 'beta-readiness-report.md');
        const docsBetaDir = path.join(this.cwd, 'docs', 'beta');
        if (!fs.existsSync(docsBetaDir)) {
            fs.mkdirSync(docsBetaDir, { recursive: true });
        }
        const officialDocPath = path.join(docsBetaDir, 'BETA_CERTIFICATION_REPORT.md');
        // 1. JSON Report
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
        // 2. Markdown Report
        const mdContent = this.buildMarkdownReport(report);
        fs.writeFileSync(mdPath, mdContent, 'utf8');
        fs.writeFileSync(officialDocPath, mdContent, 'utf8');
        // 3. Interactive HTML Dashboard
        fs.writeFileSync(htmlPath, this.buildHtmlDashboard(report), 'utf8');
        return { htmlPath, jsonPath, mdPath, officialDocPath };
    }
    buildMarkdownReport(report) {
        const suiteRows = report.suites.map((s) => {
            return `| **${s.name}** | **${s.score}%** | ${s.passed ? '✅ PASSED' : '❌ FAILED'} | ${s.telemetry} |`;
        }).join('\n');
        const riskRows = report.risks.map((r) => {
            return `| **${r.category}** | \`${r.severity}\` | ${r.description} | ${r.mitigation} |`;
        }).join('\n');
        const limitRows = report.limitations.map((l) => {
            return `| **${l.subsystem}** | ${l.description} | ${l.workaround} |`;
        }).join('\n');
        const recList = report.recommendations.map((r) => `- ${r}`).join('\n');
        return `# 🚀 Universal Visual Testing Tool — Official Public Beta Certification Report (RC-14)

**Generated At**: \`${report.timestamp}\`  
**Public Beta Release Decision**: **\`${report.decision}\`**  
**Readiness Score**: **${report.readinessScore} / 100**  
**Mandatory Suites Verified**: **${report.passedSuitesCount} / ${report.totalSuitesVerified} Certified Clean**

---

## 🏛️ Mandatory Certification Suites Audit (9 Suites)

| Certification Suite | Score | Status | Verification Telemetry |
| :--- | :---: | :---: | :--- |
${suiteRows}

---

## ⚠️ Known Limitations

| Subsystem | Limitation Description | Recommended Workaround |
| :--- | :--- | :--- |
${limitRows}

---

## 🛡️ Production Risk Analysis

| Risk Category | Severity | Description | Mitigation Strategy |
| :--- | :---: | :--- | :--- |
${riskRows}

---

## 💡 Operational Recommendations

${recList}

---
*Official Beta Certification Gatekeeper — Universal Visual Testing Tool v1.0.0-beta.1*
`;
    }
    buildHtmlDashboard(report) {
        const cards = report.suites.map((s) => {
            return `
        <div class="card">
          <div class="card-header">
            <h3>${s.name}</h3>
            <span class="badge ${s.passed ? 'pass' : 'fail'}">${s.passed ? 'CERTIFIED' : 'FAILED'}</span>
          </div>
          <div class="card-body">
            <div class="score-display">${s.score}%</div>
            <p class="details">${s.telemetry}</p>
          </div>
        </div>
      `;
        }).join('');
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UVT Official Public Beta Certification Dashboard — RC-14</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --accent: #38bdf8;
      --pass: #22c55e;
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
    .score-display { font-size: 22px; font-weight: bold; color: var(--accent); margin-bottom: 8px; }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    .badge.pass { background: rgba(34, 197, 94, 0.2); color: var(--pass); }
    .badge.fail { background: rgba(239, 68, 68, 0.2); color: var(--fail); }
    .details { font-size: 12px; color: #cbd5e1; margin-top: 8px; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>🚀 UVT Official Public Beta Certification Dashboard</h1>
      <p style="color: #94a3b8; margin: 4px 0 0 0;">Project: ${report.projectName} | Decision: <strong style="color: #22c55e;">${report.decision}</strong></p>
    </div>
    <div class="score-box">
      <div style="font-size: 12px; color: #94a3b8;">BETA READINESS SCORE</div>
      <div class="score">${report.readinessScore} / 100</div>
    </div>
  </div>

  <h2>🏛️ Mandatory Certification Suites Audit (9 Suites)</h2>
  <div class="grid">
    ${cards}
  </div>
</body>
</html>`;
    }
}
exports.BetaCertifierReporter = BetaCertifierReporter;
//# sourceMappingURL=beta-reporter.js.map