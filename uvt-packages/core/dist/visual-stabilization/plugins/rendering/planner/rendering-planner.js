"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderingPlanner = void 0;
const chart_adapters_js_1 = require("../adapters/chart-adapters.js");
const webgl_adapters_js_1 = require("../adapters/webgl-adapters.js");
class RenderingPlanner {
    config;
    adapters = [
        new chart_adapters_js_1.ChartAdapter(),
        new webgl_adapters_js_1.WebGLAdapter()
    ];
    constructor(config) {
        this.config = config;
    }
    plan(signals, pluginId) {
        if (!this.config.enabled)
            return [];
        const actions = [];
        for (const signal of signals) {
            if (!signal.evidence)
                continue;
            for (const adapter of this.adapters) {
                if (adapter.supports(signal)) {
                    actions.push(...adapter.plan(signal, this.config, pluginId));
                }
            }
        }
        return actions;
    }
}
exports.RenderingPlanner = RenderingPlanner;
//# sourceMappingURL=rendering-planner.js.map