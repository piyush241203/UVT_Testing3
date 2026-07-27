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
exports.CertificationDashboard = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const matrix_js_1 = require("./matrix.js");
class CertificationDashboard {
    matrix;
    constructor() {
        this.matrix = new matrix_js_1.CertificationMatrix();
    }
    renderMarkdown(summary) {
        let md = `# Real Repository Certification Suite (RRCS) — Dashboard\n\n`;
        md += `*Generated at: ${new Date(summary.timestamp).toISOString()}*\n\n`;
        md += this.matrix.generateMarkdownMatrix(summary);
        md += `\n\n### 📁 Detailed Repository Reports\n\n`;
        for (const report of summary.reports) {
            const badge = report.passed ? '✅ PASSED' : '❌ FAILED';
            md += `#### ${report.repoName} (${report.framework}) — ${badge} (${report.score}%)\n`;
            md += `| Item | Expected | Actual | Status |\n`;
            md += `| :--- | :--- | :--- | :---: |\n`;
            for (const item of report.items) {
                md += `| ${item.name} | ${item.expected} | ${item.actual} | ${item.passed ? '✅' : '❌'} |\n`;
            }
            md += `\n`;
        }
        return md;
    }
    renderHTML(summary) {
        const markdownMatrix = this.matrix.generateMarkdownMatrix(summary);
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Real Repository Certification Suite (RRCS) Dashboard</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --accent: #38bdf8;
      --success: #4ade80;
      --fail: #f87171;
      --border: #334155;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 2rem;
    }
    header {
      text-align: center;
      margin-bottom: 2rem;
    }
    h1 { color: var(--accent); margin-bottom: 0.5rem; }
    p { color: #94a3b8; }
    .score-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto 2rem;
    }
    .score-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1.5rem;
      text-align: center;
    }
    .score-val {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--accent);
      margin-top: 0.5rem;
    }
    table {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto 2rem;
      border-collapse: collapse;
      background: var(--card-bg);
      border-radius: 0.75rem;
      overflow: hidden;
    }
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th { background: #0284c7; color: #ffffff; }
    .badge-pass { color: var(--success); font-weight: bold; }
    .badge-fail { color: var(--fail); font-weight: bold; }
  </style>
</head>
<body>
  <header>
    <h1>Real Repository Certification Suite (RRCS)</h1>
    <p>Automated Verification across 10 Real-World Open-Source Web Framework Repositories</p>
  </header>

  <section class="score-cards">
    <div class="score-card">
      <div>Overall Score</div>
      <div class="score-val">${summary.overallScore}%</div>
    </div>
    <div class="score-card">
      <div>Repository Score</div>
      <div class="score-val">${summary.repositoryScore}%</div>
    </div>
    <div class="score-card">
      <div>Framework Score</div>
      <div class="score-val">${summary.frameworkScore}%</div>
    </div>
    <div class="score-card">
      <div>Automation Score</div>
      <div class="score-val">${summary.automationScore}%</div>
    </div>
  </section>

  <section style="max-width:1200px;margin:0 auto;">
    <h2>Certification Matrix</h2>
    <table>
      <thead>
        <tr>
          <th>Framework</th>
          <th>Repositories</th>
          <th>Passed</th>
          <th>Avg Score</th>
          <th>Certification Status</th>
        </tr>
      </thead>
      <tbody>
        ${summary.frameworkScores.map(f => `
          <tr>
            <td><strong>${f.framework.toUpperCase()}</strong></td>
            <td>${f.repositoryCount}</td>
            <td>${f.passedCount}</td>
            <td>${f.averageScore}%</td>
            <td class="${f.status === 'CERTIFIED' ? 'badge-pass' : 'badge-fail'}">${f.status === 'CERTIFIED' ? '✔ CERTIFIED' : '❌ FAILED'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>

</body>
</html>`;
    }
    saveDashboardFiles(summary, outputDir = process.cwd()) {
        const htmlPath = path.join(outputDir, 'dashboard.html');
        const mdPath = path.join(outputDir, 'dashboard.md');
        const jsonPath = path.join(outputDir, 'report.json');
        fs.writeFileSync(htmlPath, this.renderHTML(summary), 'utf-8');
        fs.writeFileSync(mdPath, this.renderMarkdown(summary), 'utf-8');
        fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2), 'utf-8');
        return { htmlPath, mdPath, jsonPath };
    }
}
exports.CertificationDashboard = CertificationDashboard;
//# sourceMappingURL=dashboard.js.map