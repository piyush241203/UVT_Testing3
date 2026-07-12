"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameworkOptimizationEngine = void 0;
const models_js_1 = require("../models/models.js");
const registry_js_1 = require("../registry/registry.js");
const react_optimizer_js_1 = require("../react/react-optimizer.js");
const next_optimizer_js_1 = require("../next/next-optimizer.js");
const static_optimizer_js_1 = require("../static/static-optimizer.js");
class FrameworkOptimizationEngine {
    config;
    registry = new registry_js_1.OptimizerRegistry();
    constructor(config) {
        this.config = { ...models_js_1.DEFAULT_FOE_CONFIG, ...config };
        // Register Default Optimizers (Order matters for inheritance, e.g. Next before React)
        this.registry.register(new next_optimizer_js_1.NextOptimizer());
        this.registry.register(new react_optimizer_js_1.ReactOptimizer());
        this.registry.register(new static_optimizer_js_1.StaticOptimizer());
    }
    optimize(decisions, context) {
        if (!this.config.enabled || decisions.length === 0) {
            return decisions.map(d => ({ ...d, isOptimized: false }));
        }
        const optimizers = this.registry.getOptimizers();
        let optimized = [];
        // Find the first optimizer that supports the context
        let selectedOptimizer = optimizers.find(o => o.supports(context));
        if (selectedOptimizer) {
            context.logger.info(`FOE: Using ${selectedOptimizer.id} to optimize ${decisions.length} decisions.`);
            optimized = selectedOptimizer.optimize(decisions, context);
        }
        else {
            context.logger.info(`FOE: No framework optimizer found. Falling back to default execution.`);
            optimized = decisions.map(d => ({ ...d, isOptimized: false }));
        }
        // Merge compatible decisions
        if (this.config.mergeCompatibleDecisions) {
            optimized = this.mergeDecisions(optimized);
        }
        return optimized;
    }
    mergeDecisions(decisions) {
        const merged = new Map();
        for (const d of decisions) {
            const key = `${d.target}-${d.optimizedStrategy || d.recommendedStrategy}`;
            if (!merged.has(key) || d.confidence > merged.get(key).confidence) {
                merged.set(key, d);
            }
        }
        return Array.from(merged.values());
    }
}
exports.FrameworkOptimizationEngine = FrameworkOptimizationEngine;
//# sourceMappingURL=engine.js.map