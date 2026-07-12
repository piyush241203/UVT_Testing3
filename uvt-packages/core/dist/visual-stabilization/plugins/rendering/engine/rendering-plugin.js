"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderingStabilizationPlugin = void 0;
const models_js_1 = require("../../../models/models.js");
const rendering_planner_js_1 = require("../planner/rendering-planner.js");
const models_js_2 = require("../models/models.js");
class RenderingStabilizationPlugin {
    id = 'RenderingStabilizationPlugin';
    priority = models_js_1.PluginPriority.High;
    planner;
    constructor(config) {
        this.planner = new rendering_planner_js_1.RenderingPlanner({ ...models_js_2.DEFAULT_RENDERING_CONFIG, ...config });
    }
    initialize() { }
    dispose() { }
    supports(decision) {
        return decision.evidence.some(s => s.tags?.some(tag => ['HAS_CHART', 'HAS_WEBGL', 'HAS_RENDER_LOOP', 'HAS_DYNAMIC_RENDERING'].includes(tag)));
    }
    plan(decisions) {
        const signals = decisions.flatMap(d => d.evidence);
        return this.planner.plan(signals, this.id);
    }
}
exports.RenderingStabilizationPlugin = RenderingStabilizationPlugin;
//# sourceMappingURL=rendering-plugin.js.map