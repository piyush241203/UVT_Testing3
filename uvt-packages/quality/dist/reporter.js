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
exports.QualityReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Simple zero-dependency ANSI formatting helpers
const ansi = {
    bold: (s) => `\x1b[1m${s}\x1b[22m`,
    cyan: (s) => `\x1b[36m${s}\x1b[39m`,
    green: (s) => `\x1b[32m${s}\x1b[39m`,
    yellow: (s) => `\x1b[33m${s}\x1b[39m`,
    red: (s) => `\x1b[31m${s}\x1b[39m`,
    gray: (s) => `\x1b[90m${s}\x1b[39m`
};
class QualityReporter {
    renderConsole(report) {
        let out = '\n';
        out += ansi.cyan('==================================================\n');
        out += ansi.cyan(ansi.bold('           AUTOMATION QUALITY SCORECARD           \n'));
        out += ansi.cyan('==================================================\n');
        const scoreColor = report.overallScore >= 90 ? ansi.green : report.overallScore >= 75 ? ansi.yellow : ansi.red;
        out += `${ansi.bold('OVERALL AUTOMATION SCORE:')} ${scoreColor(ansi.bold(`${report.overallScore}%`))} (${report.status})\n`;
        out += ansi.gray('--------------------------------------------------\n');
        out += ansi.bold('METRIC BREAKDOWN:\n');
        for (const key of Object.keys(report.metrics)) {
            const metric = report.metrics[key];
            const color = metric.score >= 90 ? ansi.green : metric.score >= 75 ? ansi.yellow : ansi.red;
            const keyLabel = (metric.name + ':').padEnd(26, ' ');
            out += `  - ${keyLabel} ${color(ansi.bold(`${metric.score}%`))}\n`;
        }
        if (report.allDeductions.length > 0) {
            out += ansi.gray('--------------------------------------------------\n');
            out += ansi.bold(ansi.yellow('WHY DEDUCTIONS OCCURRED (EXPLANATIONS):\n'));
            for (const d of report.allDeductions) {
                out += `  ${ansi.red(`-[${d.pointsLost}%]`)} ${ansi.bold(d.metricName)}: ${d.reason}\n`;
                out += `         ${ansi.gray(`💡 Fix: ${d.recommendation}`)}\n`;
            }
        }
        else {
            out += ansi.gray('--------------------------------------------------\n');
            out += ansi.green('✔ Perfect 100% Score! Zero quality deductions.\n');
        }
        out += ansi.cyan('==================================================\n\n');
        return out;
    }
    renderMarkdown(report) {
        let md = `# Automation Quality Report\n\n`;
        md += `*Generated at: ${new Date(report.timestamp).toISOString()}*\n\n`;
        md += `## Overall Automation Score: **${report.overallScore}%** (${report.status})\n\n`;
        md += `### 📊 Metric Breakdown\n\n`;
        md += `| Metric | Score | Weight |\n`;
        md += `| :--- | :---: | :---: |\n`;
        for (const key of Object.keys(report.metrics)) {
            const metric = report.metrics[key];
            md += `| **${metric.name}** | ${metric.score}% | ${Math.round(metric.weight * 100)}% |\n`;
        }
        if (report.allDeductions.length > 0) {
            md += `\n### ⚠️ Deduction Explanations (Why Points Were Lost)\n\n`;
            md += `| Metric | Points Lost | Reason | Recommended Action |\n`;
            md += `| :--- | :---: | :--- | :--- |\n`;
            for (const d of report.allDeductions) {
                md += `| **${d.metricName}** | -${d.pointsLost}% | ${d.reason} | ${d.recommendation} |\n`;
            }
        }
        return md;
    }
    renderHTML(report) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Automation Quality Report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
    h1 { color: #38bdf8; text-align: center; }
    .score-badge { text-align: center; font-size: 3rem; font-weight: bold; color: ${report.overallScore >= 80 ? '#4ade80' : '#f87171'}; margin: 1rem 0; }
    table { width: 100%; max-width: 900px; margin: 2rem auto; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden; }
    th, td { padding: 1rem; border-bottom: 1px solid #334155; text-align: left; }
    th { background: #0284c7; color: white; }
    .deduction { color: #f87171; }
  </style>
</head>
<body>
  <h1>Repository Automation Quality Scorecard</h1>
  <div class="score-badge">${report.overallScore}% (${report.status})</div>
  <table>
    <thead><tr><th>Metric</th><th>Score</th><th>Weight</th></tr></thead>
    <tbody>
      ${Object.keys(report.metrics).map(k => {
            const m = report.metrics[k];
            return `<tr><td><strong>${m.name}</strong></td><td>${m.score}%</td><td>${Math.round(m.weight * 100)}%</td></tr>`;
        }).join('')}
    </tbody>
  </table>
  ${report.allDeductions.length > 0 ? `
    <h2 style="text-align:center;color:#fbbf24;">Deduction Explanations</h2>
    <table>
      <thead><tr><th>Metric</th><th>Loss</th><th>Reason</th><th>Fix</th></tr></thead>
      <tbody>
        ${report.allDeductions.map(d => `<tr><td><strong>${d.metricName}</strong></td><td class="deduction">-${d.pointsLost}%</td><td>${d.reason}</td><td>${d.recommendation}</td></tr>`).join('')}
      </tbody>
    </table>
  ` : ''}
</body>
</html>`;
    }
    saveReportFiles(report, outputDir = process.cwd()) {
        const htmlPath = path.join(outputDir, 'quality-report.html');
        const mdPath = path.join(outputDir, 'quality-report.md');
        const jsonPath = path.join(outputDir, 'quality-report.json');
        fs.writeFileSync(htmlPath, this.renderHTML(report), 'utf-8');
        fs.writeFileSync(mdPath, this.renderMarkdown(report), 'utf-8');
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
        return { htmlPath, mdPath, jsonPath };
    }
}
exports.QualityReporter = QualityReporter;
//# sourceMappingURL=reporter.js.map