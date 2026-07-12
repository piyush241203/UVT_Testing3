"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicDecisionEngine = void 0;
const models_js_1 = require("../models/models.js");
const correlation_engine_js_1 = require("../correlation/correlation-engine.js");
const confidence_calculator_js_1 = require("../confidence/confidence-calculator.js");
const conflict_resolver_js_1 = require("../conflicts/conflict-resolver.js");
class DynamicDecisionEngine {
    config;
    correlationEngine = new correlation_engine_js_1.CorrelationEngine();
    confidenceCalculator;
    conflictResolver = new conflict_resolver_js_1.ConflictResolver();
    constructor(config) {
        this.config = { ...models_js_1.DEFAULT_DECISION_CONFIG, ...config };
        this.confidenceCalculator = new confidence_calculator_js_1.ConfidenceCalculator(this.config);
    }
    evaluate(signals) {
        if (!this.config.enabled)
            return [];
        const correlatedGroups = this.correlationEngine.correlate(signals);
        const decisions = [];
        let idCounter = 0;
        for (const [target, groupSignals] of correlatedGroups.entries()) {
            const confidence = this.confidenceCalculator.calculate(groupSignals);
            if (confidence >= this.config.minimumConfidence || (this.config.allowSingleCriticalSignal && groupSignals.length > 0)) {
                decisions.push({
                    id: `decision-${Date.now()}-${idCounter++}`,
                    target,
                    region: 'unknown',
                    confidence,
                    recommendedStrategy: 'Auto', // Derived by plugins later, or inferred here
                    plugins: [],
                    evidence: groupSignals,
                    priority: 2,
                    reason: `Confidence ${confidence} based on ${groupSignals.length} signals`,
                    verificationRequired: true,
                    rollbackRequired: true
                });
            }
        }
        return this.conflictResolver.resolve(decisions);
    }
}
exports.DynamicDecisionEngine = DynamicDecisionEngine;
//# sourceMappingURL=decision-engine.js.map