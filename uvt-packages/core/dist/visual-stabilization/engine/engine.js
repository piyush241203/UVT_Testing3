"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualStabilizationEngine = void 0;
const plugin_registry_js_1 = require("../registry/plugin-registry.js");
const core_plugins_js_1 = require("../plugins/core-plugins.js");
const planner_js_1 = require("../planner/planner.js");
const browser_executor_js_1 = require("../executor/browser-executor.js");
const verification_js_1 = require("../verification/verification.js");
class VisualStabilizationEngine {
    registry = new plugin_registry_js_1.PluginRegistry();
    planner = new planner_js_1.StabilizationPlanner();
    constructor() {
        for (const plugin of (0, core_plugins_js_1.getAllPlugins)()) {
            this.registry.register(plugin);
        }
    }
    async stabilize(page, decisions) {
        const startTime = Date.now();
        const plugins = this.registry.getPlugins();
        const plannedActions = this.planner.plan(decisions, plugins);
        let executorResult = { success: true, actionsApplied: 0, actionsFailed: 0, errors: [] };
        if (plannedActions.length > 0) {
            try {
                executorResult = await page.evaluate(`(${browser_executor_js_1.BROWSER_EXECUTOR_SCRIPT})(${JSON.stringify(plannedActions)})`);
            }
            catch (e) {
                executorResult = { success: false, actionsApplied: 0, actionsFailed: plannedActions.length, errors: [String(e)] };
            }
        }
        const verification = verification_js_1.VerificationEngine.verify(executorResult, plannedActions);
        return {
            pluginsLoaded: plugins.length,
            actionsPlanned: plannedActions.length,
            verification,
            executionTimeMs: Date.now() - startTime
        };
    }
}
exports.VisualStabilizationEngine = VisualStabilizationEngine;
//# sourceMappingURL=engine.js.map