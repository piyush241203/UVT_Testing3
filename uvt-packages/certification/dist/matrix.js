"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationMatrix = void 0;
class CertificationMatrix {
    generateMarkdownMatrix(summary) {
        let md = `## 📊 Real Repository Certification Matrix\n\n`;
        md += `| Framework | Repositories | Passed | Avg Score | Certification Status |\n`;
        md += `| :--- | :---: | :---: | :---: | :--- |\n`;
        for (const fw of summary.frameworkScores) {
            const badge = fw.status === 'CERTIFIED' ? '✅ CERTIFIED' : '❌ FAILED';
            md += `| **${fw.framework.toUpperCase()}** | ${fw.repositoryCount} | ${fw.passedCount} | ${fw.averageScore}% | ${badge} |\n`;
        }
        md += `\n### 🏆 Executive Scoring Summary\n`;
        md += `- **Repository Score**: ${summary.repositoryScore}%\n`;
        md += `- **Framework Score**: ${summary.frameworkScore}%\n`;
        md += `- **Automation Score**: ${summary.automationScore}%\n`;
        md += `- **Overall Score**: **${summary.overallScore}%**\n`;
        return md;
    }
}
exports.CertificationMatrix = CertificationMatrix;
//# sourceMappingURL=matrix.js.map