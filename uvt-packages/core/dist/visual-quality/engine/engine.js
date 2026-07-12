"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualQualityEngine = void 0;
const models_js_1 = require("../models/models.js");
const scoring_engine_js_1 = require("../scoring/scoring-engine.js");
const heuristics_js_1 = require("../metrics/heuristics.js");
class VisualQualityEngine {
    config;
    scoring = new scoring_engine_js_1.ScoringEngine();
    heuristics = new heuristics_js_1.HeuristicsEngine();
    constructor(config) {
        this.config = { ...models_js_1.DEFAULT_QUALITY_CONFIG, ...config };
    }
    async evaluate(context, vseMetadata) {
        if (!this.config.enabled)
            return null;
        context.logger.info(`VQE: Evaluating visual quality...`);
        const detectedHeuristics = this.config.detectOverStabilization || this.config.detectUnderStabilization
            ? this.heuristics.evaluate(vseMetadata)
            : [];
        const pluginStats = [];
        if (this.config.evaluatePluginEffectiveness) {
            pluginStats.push({
                pluginId: 'Generic',
                executions: vseMetadata?.actionsPlanned || 0,
                successes: vseMetadata?.actionsApplied || 0,
                failures: vseMetadata?.actionsFailed || 0,
                rollbacks: 0,
                averageExecutionTimeMs: vseMetadata?.executionTimeMs || 0,
                confidence: 90,
                regionsAffected: vseMetadata?.actionsApplied || 0
            });
        }
        const report = this.scoring.calculateScore(detectedHeuristics, pluginStats, vseMetadata?.actionsApplied || 0, vseMetadata?.actionsFailed || 0);
        context.runtimeMetadata.set('visualQuality', report);
        context.logger.info(`VQE: Quality Score = ${report.score}. FP Risk = ${report.falsePositiveRisk}`);
        if (this.config.sendFeedbackToKnowledgeEngine) {
            try {
                const { KnowledgeEngine } = await import('../../knowledge/index.js');
                const kpe = new KnowledgeEngine();
                // Send structured report to KPE
                await kpe.recordFeedback(context, report);
            }
            catch (e) {
                context.logger.warn(`VQE: Failed to send feedback to KPE: ${e.message}`);
            }
        }
        return report;
    }
}
exports.VisualQualityEngine = VisualQualityEngine;
//# sourceMappingURL=engine.js.map