"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompatibilityRunner = void 0;
const matrix_js_1 = require("../matrix/matrix.js");
class CompatibilityRunner {
    async runMatrix() {
        const scores = [];
        for (const target of matrix_js_1.REPOSITORY_MATRIX) {
            scores.push(await this.evaluateTarget(target));
        }
        const overallScore = scores.reduce((acc, s) => acc + s.score, 0) / scores.length;
        const frameworkScores = {};
        scores.forEach(s => {
            if (!frameworkScores[s.framework])
                frameworkScores[s.framework] = s.score;
            else
                frameworkScores[s.framework] = (frameworkScores[s.framework] + s.score) / 2;
        });
        return {
            timestamp: new Date().toISOString(),
            overallScore: Number(overallScore.toFixed(2)),
            frameworkScores,
            targets: scores
        };
    }
    async evaluateTarget(target) {
        await new Promise(r => setTimeout(r, 50));
        const telemetry = target.mockTelemetry || {
            accuracy: 90, stabilizationSuccess: 90, falsePositiveRate: 5, executionTimeMs: 1000, memoryUsageMb: 100
        };
        const score = (telemetry.accuracy * 0.4) + (telemetry.stabilizationSuccess * 0.4) + ((100 - telemetry.falsePositiveRate) * 0.2);
        return {
            targetId: target.id,
            framework: target.framework,
            score: Number(score.toFixed(2)),
            accuracy: telemetry.accuracy,
            stabilizationSuccess: telemetry.stabilizationSuccess,
            falsePositiveRate: telemetry.falsePositiveRate,
            executionTimeMs: telemetry.executionTimeMs
        };
    }
}
exports.CompatibilityRunner = CompatibilityRunner;
//# sourceMappingURL=runner.js.map