"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalPlanner = void 0;
const models_js_1 = require("../../../models/models.js");
const models_js_2 = require("../models/models.js");
class TemporalPlanner {
    config;
    constructor(config) {
        this.config = { ...models_js_2.DEFAULT_TEMPORAL_CONFIG, ...config };
    }
    plan(signals, pluginId) {
        if (!this.config.enabled)
            return [];
        const actions = [];
        for (const signal of signals) {
            if (!signal.evidence)
                continue;
            for (const evidence of signal.evidence) {
                const ev = evidence;
                if (ev.type !== 'dom-selector' || !ev.value)
                    continue;
                const selector = ev.value;
                const tags = signal.tags || [];
                let strategy = 'Replace';
                let replacementValue = this.config.freezeTime;
                if (tags.includes('HAS_COUNTDOWN')) {
                    replacementValue = this.config.freezeCountdown;
                }
                else if (tags.includes('USES_DYNAMIC_DATE') || tags.includes('USES_DATE')) {
                    replacementValue = this.config.freezeDate;
                }
                else if (tags.includes('HAS_DYNAMIC_TIMER')) {
                    // If it's a timer updating rapidly, could be clock or elapsed
                    replacementValue = this.config.freezeTime;
                }
                // We use Replace to strictly enforce the mock value. 
                // Freeze is useful for CSS animations, Replace is better for text content.
                actions.push({
                    pluginId,
                    selector,
                    strategy: 'Replace',
                    priority: models_js_1.PluginPriority.High,
                    value: replacementValue,
                    reason: 'Temporal logic: ' + tags.join(', ')
                });
            }
        }
        return actions;
    }
}
exports.TemporalPlanner = TemporalPlanner;
//# sourceMappingURL=temporal-planner.js.map