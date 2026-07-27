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
exports.CompatibilityMatrixReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class CompatibilityMatrixReporter {
    cwd;
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }
    printConsoleSummary(report) {
        console.log('\n===================================================================');
        console.log(`🌐 UVT OFFICIAL COMPATIBILITY MATRIX DASHBOARD — RC-10`);
        console.log('===================================================================');
        console.log(` Generated At     : ${report.generatedAt}`);
        console.log(` Total Scenarios  : ${report.totalCombinations} combinations`);
        console.log(` Overall Score    : ${report.overallScore} / 100`);
        console.log(` Pass Rate        : ${report.passRatePercent}%`);
        console.log('-------------------------------------------------------------------');
        console.log(' Framework    Total   Certified   Compatible   Experimental   Score');
        console.log('-------------------------------------------------------------------');
        for (const fw of report.frameworkSummaries) {
            const name = fw.framework.padEnd(12, ' ');
            const total = `${fw.totalCombinations}`.padEnd(7, ' ');
            const cert = `${fw.certifiedCount}`.padEnd(11, ' ');
            const comp = `${fw.compatibleCount}`.padEnd(12, ' ');
            const exp = `${fw.experimentalCount}`.padEnd(14, ' ');
            const score = `${fw.averageScore}%`;
            console.log(` ${name} ${total} ${cert} ${comp} ${exp} ${score}`);
        }
        console.log('===================================================================\n');
    }
    generateAllReports(report) {
        const dir = path.join(this.cwd, '.uvt', 'compatibility');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const htmlPath = path.join(dir, 'compatibility-dashboard.html');
        const jsonPath = path.join(dir, 'compatibility-report.json');
        const mdPath = path.join(dir, 'compatibility-report.md');
        // 1. JSON Report
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
        // 2. Markdown Report
        const mdContent = this.buildMarkdownReport(report);
        fs.writeFileSync(mdPath, mdContent, 'utf8');
        // 3. Interactive HTML Dashboard
        const htmlContent = this.buildHtmlDashboard(report);
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        return { htmlPath, jsonPath, mdPath };
    }
    buildMarkdownReport(report) {
        const summaryRows = report.frameworkSummaries.map((fw) => {
            return `| **${fw.framework}** | ${fw.totalCombinations} | **${fw.certifiedCount}** | ${fw.compatibleCount} | ${fw.experimentalCount} | ${fw.unsupportedCount} | **${fw.passRatePercent}%** | **${fw.averageScore}/100** |`;
        }).join('\n');
        return `# 🌐 UVT Official Compatibility Matrix Report (RC-10)

**Generated At**: \`${report.generatedAt}\`  
**Total Verified Combinations**: **${report.totalCombinations}**  
**Overall Compatibility Score**: **${report.overallScore} / 100**  
**Pass Rate**: **${report.passRatePercent}%**

## 🏛️ Framework Certification Summary

| Framework | Verified Combinations | Certified | Compatible | Experimental | Unsupported | Pass Rate | Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
${summaryRows}

---
*Generated automatically by Universal Visual Testing Tool — Official Certification Engine*
`;
    }
    buildHtmlDashboard(report) {
        const fwCards = report.frameworkSummaries.map((fw) => {
            return `
        <div class="fw-card">
          <div class="fw-header">
            <h3>${fw.framework}</h3>
            <span class="badge score-badge">${fw.averageScore}%</span>
          </div>
          <div class="fw-body">
            <div class="row"><span>Total Verified:</span> <strong>${fw.totalCombinations}</strong></div>
            <div class="row"><span>Certified:</span> <strong style="color: #22c55e;">${fw.certifiedCount}</strong></div>
            <div class="row"><span>Compatible:</span> <strong style="color: #38bdf8;">${fw.compatibleCount}</strong></div>
            <div class="row"><span>Experimental:</span> <strong style="color: #eab308;">${fw.experimentalCount}</strong></div>
            <div class="row"><span>Pass Rate:</span> <strong>${fw.passRatePercent}%</strong></div>
          </div>
        </div>
      `;
        }).join('');
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UVT Official Compatibility Matrix Dashboard — RC-10</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --accent: #38bdf8;
      --pass: #22c55e;
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
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .fw-card {
      background: var(--card-bg);
      border-radius: 8px;
      border: 1px solid #334155;
      padding: 16px;
    }
    .fw-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .fw-header h3 { margin: 0; font-size: 18px; color: #f8fafc; }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      background: rgba(56, 189, 248, 0.2);
      color: var(--accent);
    }
    .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; color: #94a3b8; }
    .row strong { color: #f8fafc; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>🌐 UVT Official Compatibility Matrix Dashboard (RC-10)</h1>
      <p style="color: #94a3b8; margin: 4px 0 0 0;">Verified ${report.totalCombinations} Combinations across 10 Frameworks | ${report.generatedAt}</p>
    </div>
    <div class="score-box">
      <div style="font-size: 12px; color: #94a3b8;">OVERALL COMPATIBILITY SCORE</div>
      <div class="score">${report.overallScore} / 100</div>
    </div>
  </div>

  <h2>🏛️ Certified Frameworks Catalog (10 Frameworks)</h2>
  <div class="grid">
    ${fwCards}
  </div>
</body>
</html>`;
    }
}
exports.CompatibilityMatrixReporter = CompatibilityMatrixReporter;
//# sourceMappingURL=matrix-reporter.js.map