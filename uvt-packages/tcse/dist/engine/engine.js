"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCSEEngine = void 0;
const registry_js_1 = require("../registry/registry.js");
const decision_js_1 = require("../models/decision.js");
const confidence_js_1 = require("../models/confidence.js");
class TCSEEngine {
    registry;
    confidenceModel;
    constructor(registry = registry_js_1.defaultTCSERegistry, confidenceModel = new confidence_js_1.DefaultConfidenceModel()) {
        this.registry = registry;
        this.confidenceModel = confidenceModel;
    }
    getRegistry() {
        return this.registry;
    }
    getConfidenceModel() {
        return this.confidenceModel;
    }
    /**
     * Main entry point to run Third-Party Content Stabilization Engine processing.
     * If zero plugins are registered or enabled, returns a zero-op result immediately.
     */
    async process(context = {}) {
        const startTime = Date.now();
        // Check if TCSE is disabled via config
        const tcseCfg = context.config?.tcse;
        if (tcseCfg && tcseCfg.enabled === false) {
            context.logger?.debug?.('TCSEEngine: Disabled via configuration (tcse.enabled = false). Executing zero-op pass-through.');
            return {
                signals: [],
                decisions: [],
                durationMs: Date.now() - startTime,
                isZeroOp: true,
                timestamp: startTime
            };
        }
        const enabledPlugins = this.registry.getEnabledPlugins();
        if (enabledPlugins.length === 0) {
            context.logger?.debug?.('TCSEEngine: Zero plugins registered/enabled. Executing zero-op pass-through.');
            return {
                signals: [],
                decisions: [],
                durationMs: Date.now() - startTime,
                isZeroOp: true,
                timestamp: startTime
            };
        }
        const allSignals = [];
        const allDecisions = [];
        for (const plugin of enabledPlugins) {
            try {
                if (plugin.initialize) {
                    await plugin.initialize(context);
                }
                if (plugin.detect) {
                    const detected = await plugin.detect(context);
                    if (Array.isArray(detected)) {
                        for (const sig of detected) {
                            // Score signal with confidence model if score is not manually set
                            const scoreEval = this.confidenceModel.evaluate(sig);
                            sig.confidenceScore = scoreEval.score;
                            allSignals.push(sig);
                        }
                    }
                }
                if (plugin.evaluate) {
                    const evaluated = await plugin.evaluate(allSignals, context);
                    if (Array.isArray(evaluated)) {
                        allDecisions.push(...evaluated);
                    }
                }
                else if (allSignals.length > 0) {
                    // Default decision generator using resolveAdAction threshold rules
                    const { resolveAdAction } = await import('../stabilization/ad-stabilizer.js');
                    for (const sig of allSignals) {
                        const action = sig.suggestedAction || resolveAdAction(sig.confidenceScore);
                        allDecisions.push((0, decision_js_1.createTCSEDecision)(sig, action, `TCSE ad stabilization decision for ${sig.category}`));
                    }
                }
            }
            catch (err) {
                context.logger?.error?.(`TCSEEngine: Plugin ${plugin.name} execution failed: ${err.message}`);
            }
            finally {
                if (plugin.dispose) {
                    try {
                        await plugin.dispose();
                    }
                    catch { }
                }
            }
        }
        return {
            signals: allSignals,
            decisions: allDecisions,
            durationMs: Date.now() - startTime,
            isZeroOp: false,
            timestamp: startTime
        };
    }
    /**
     * Applies generated stabilization decisions onto page if page context is present.
     */
    async stabilize(context, decisions) {
        if (!context.page || !decisions || decisions.length === 0) {
            return 0;
        }
        const { AdStabilizer } = await import('../stabilization/ad-stabilizer.js');
        const stabilizer = new AdStabilizer();
        let appliedCount = 0;
        for (const dec of decisions) {
            const success = await stabilizer.stabilize(context.page, dec);
            if (success)
                appliedCount++;
        }
        context.logger?.info?.(`TCSEEngine: Applied ${appliedCount} ad stabilization decisions.`);
        return appliedCount;
    }
}
exports.TCSEEngine = TCSEEngine;
//# sourceMappingURL=engine.js.map