"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityStabilizationPlugin = void 0;
const models_js_1 = require("../../../models/models.js");
const identity_planner_js_1 = require("../planner/identity-planner.js");
const models_js_2 = require("../models/models.js");
class IdentityStabilizationPlugin {
    id = 'IdentityStabilizationPlugin';
    priority = models_js_1.PluginPriority.Critical;
    planner;
    constructor(config) {
        this.planner = new identity_planner_js_1.IdentityPlanner({ ...models_js_2.DEFAULT_IDENTITY_CONFIG, ...config });
    }
    initialize() { }
    dispose() { }
    supports(decision) {
        return decision.evidence.some(s => s.tags?.some(t => ['HAS_UUID', 'HAS_TOKEN', 'HAS_TRACE_ID', 'HAS_REQUEST_ID', 'HAS_SESSION_ID'].includes(t)));
    }
    plan(decisions) {
        const signals = decisions.flatMap(d => d.evidence);
        return this.planner.plan(signals, this.id);
    }
}
exports.IdentityStabilizationPlugin = IdentityStabilizationPlugin;
//# sourceMappingURL=identity-plugin.js.map