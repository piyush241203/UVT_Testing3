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
exports.ArtifactValidationReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ArtifactValidationReporter {
    renderConsole(report) {
        let out = '\n==================================================\n';
        out += '      ARTIFACT VALIDATION ENGINE 2.0 REPORT       \n';
        out += '==================================================\n';
        out += `Total Artifacts Validated : ${report.totalValidated}\n`;
        out += `Total Passed              : ${report.totalPassed}\n`;
        out += `Total Auto-Regenerated    : ${report.totalAutoRegenerated}\n`;
        out += `Status                    : ${report.overallPassed ? '✔ ALL PASSED 100%' : '❌ FAILURE DETECTED'}\n`;
        out += '--------------------------------------------------\n';
        for (const res of report.results) {
            const icon = res.passed ? '✔' : '❌';
            const regenLabel = res.autoRegenerated ? ' (Auto-Regenerated)' : '';
            out += `${icon} ${res.artifactId} (${res.kind})${regenLabel}\n`;
            out += `   Phases: Parse:${res.phases.parse.passed ? '✔' : '❌'} | Compile:${res.phases.compile.passed ? '✔' : '❌'} | Execute:${res.phases.execute.passed ? '✔' : '❌'} | DryRun:${res.phases.dryRun.passed ? '✔' : '❌'}\n`;
            if (res.errors.length > 0) {
                res.errors.forEach(e => { out += `   ⚠️ Error: ${e}\n`; });
            }
        }
        out += '==================================================\n\n';
        return out;
    }
    renderMarkdown(report) {
        let md = `# Artifact Validation Engine 2.0 Report\n\n`;
        md += `*Generated at: ${new Date(report.timestamp).toISOString()}*\n\n`;
        md += `- **Total Validated**: ${report.totalValidated}\n`;
        md += `- **Total Passed**: ${report.totalPassed}\n`;
        md += `- **Total Auto-Regenerated**: ${report.totalAutoRegenerated}\n`;
        md += `- **Status**: **${report.overallPassed ? 'PASSED 100%' : 'FAILED'}**\n\n`;
        md += `| Artifact ID | Kind | Parse | Compile | Execute | Dry Run | Status |\n`;
        md += `| :--- | :--- | :---: | :---: | :---: | :---: | :---: |\n`;
        for (const r of report.results) {
            md += `| **${r.artifactId}** | ${r.kind} | ${r.phases.parse.passed ? '✅' : '❌'} | ${r.phases.compile.passed ? '✅' : '❌'} | ${r.phases.execute.passed ? '✅' : '❌'} | ${r.phases.dryRun.passed ? '✅' : '❌'} | ${r.passed ? '✅ PASSED' : '❌ FAILED'} |\n`;
        }
        return md;
    }
    renderHTML(report) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Artifact Validation Engine 2.0 Report</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
    h1 { color: #38bdf8; text-align: center; }
    table { width: 100%; max-width: 1000px; margin: 2rem auto; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden; }
    th, td { padding: 1rem; border-bottom: 1px solid #334155; text-align: left; }
    th { background: #0284c7; color: white; }
    .pass { color: #4ade80; font-weight: bold; }
    .fail { color: #f87171; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Artifact Validation Engine 2.0 Report</h1>
  <div style="text-align:center;font-size:1.5rem;margin:1rem 0;">Status: <span class="${report.overallPassed ? 'pass' : 'fail'}">${report.overallPassed ? '✔ ALL PASSED 100%' : '❌ FAILED'}</span></div>
  <table>
    <thead><tr><th>Artifact</th><th>Kind</th><th>Parse</th><th>Compile</th><th>Execute</th><th>Dry Run</th><th>Status</th></tr></thead>
    <tbody>
      ${report.results.map(r => `
        <tr>
          <td><strong>${r.artifactId}</strong></td>
          <td>${r.kind}</td>
          <td>${r.phases.parse.passed ? '✔' : '❌'}</td>
          <td>${r.phases.compile.passed ? '✔' : '❌'}</td>
          <td>${r.phases.execute.passed ? '✔' : '❌'}</td>
          <td>${r.phases.dryRun.passed ? '✔' : '❌'}</td>
          <td class="${r.passed ? 'pass' : 'fail'}">${r.passed ? '✔ PASSED' : '❌ FAILED'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;
    }
    saveReportFiles(report, outputDir = process.cwd()) {
        const htmlPath = path.join(outputDir, 'artifact-validation-report.html');
        const mdPath = path.join(outputDir, 'artifact-validation-report.md');
        const jsonPath = path.join(outputDir, 'artifact-validation-report.json');
        fs.writeFileSync(htmlPath, this.renderHTML(report), 'utf-8');
        fs.writeFileSync(mdPath, this.renderMarkdown(report), 'utf-8');
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
        return { htmlPath, mdPath, jsonPath };
    }
}
exports.ArtifactValidationReporter = ArtifactValidationReporter;
//# sourceMappingURL=reporter.js.map