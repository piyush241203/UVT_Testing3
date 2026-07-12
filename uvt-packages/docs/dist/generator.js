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
exports.DocsGenerator = void 0;
const compatibility_1 = require("@uvt/compatibility");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DocsGenerator {
    async generateMatrix() {
        const runner = new compatibility_1.CompatibilityRunner();
        const report = await runner.runMatrix();
        let md = `# Live Compatibility Matrix\n\n`;
        md += `*Generated automatically from the UCVS engine at ${report.timestamp}*\n\n`;
        md += `**Overall Platform Score**: ${report.overallScore}%\n\n`;
        md += `## Framework Scores\n`;
        Object.entries(report.frameworkScores).forEach(([fw, score]) => {
            md += `- **${fw}**: ${score}%\n`;
        });
        md += `\n## Detailed Repository Matrix\n`;
        md += `| Repository | Framework | Score | Execution Time |\n`;
        md += `|---|---|---|---|\n`;
        report.targets.forEach(target => {
            md += `| ${target.targetId} | ${target.framework} | ${target.score}% | ${target.executionTimeMs}ms |\n`;
        });
        const outPath = path.join(process.cwd(), 'compatibility', 'matrix.md');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, md);
    }
}
exports.DocsGenerator = DocsGenerator;
//# sourceMappingURL=generator.js.map