"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalStabilizationPlugin = void 0;
const models_js_1 = require("../../../models/models.js");
const temporal_planner_js_1 = require("../planner/temporal-planner.js");
const models_js_2 = require("../models/models.js");
class TemporalStabilizationPlugin {
    id = 'TemporalStabilizationPlugin';
    priority = models_js_1.PluginPriority.High;
    planner;
    constructor(config) {
        this.planner = new temporal_planner_js_1.TemporalPlanner({ ...models_js_2.DEFAULT_TEMPORAL_CONFIG, ...config });
    }
    initialize() { }
    dispose() { }
    supports(decision) {
        return decision.evidence.some(s => s.tags?.some(t => ['HAS_CLOCK', 'HAS_TIMER', 'HAS_RELATIVE_TIME', 'HAS_DATE'].includes(t)));
    }
    plan(decisions) {
        const signals = decisions.flatMap(d => d.evidence);
        return this.planner.plan(signals, this.id);
    }
}
exports.TemporalStabilizationPlugin = TemporalStabilizationPlugin;
//# sourceMappingURL=temporal-plugin.js.map