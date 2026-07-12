"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringEngine = void 0;
class ScoringEngine {
    calculateScore(heuristics, pluginStats, actionsApplied, actionsFailed) {
        let score = 100;
        const warnings = [];
        const recommendations = [];
        const overStab = heuristics.filter(h => h.type === 'OverStabilization');
        const underStab = heuristics.filter(h => h.type === 'UnderStabilization');
        if (overStab.length > 0) {
            score -= overStab.length * 10;
            warnings.push(`Detected ${overStab.length} potential over-stabilization risks.`);
        }
        if (underStab.length > 0) {
            score -= underStab.length * 15;
            warnings.push(`Detected ${underStab.length} potential under-stabilization risks.`);
        }
        if (actionsFailed > 0) {
            score -= (actionsFailed * 5);
            recommendations.push('Investigate failing plugins.');
        }
        const efficiency = actionsApplied > 0 ? (actionsApplied / (actionsApplied + actionsFailed)) * 100 : 100;
        score = Math.max(0, Math.min(100, score));
        const fpRisk = score < 50 ? 'High' : (score < 80 ? 'Medium' : 'Low');
        return {
            score,
            falsePositiveRisk: fpRisk,
            regressionCoverage: Math.max(0, 100 - (underStab.length * 10)),
            stabilizationEfficiency: efficiency,
            pluginStatistics: pluginStats,
            heuristics,
            warnings,
            recommendations
        };
    }
}
exports.ScoringEngine = ScoringEngine;
//# sourceMappingURL=scoring-engine.js.map