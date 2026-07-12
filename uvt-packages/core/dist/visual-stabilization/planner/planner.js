"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StabilizationPlanner = void 0;
class StabilizationPlanner {
    plan(decisions, plugins) {
        const actions = [];
        // Group decisions by plugin capabilities
        for (const plugin of plugins) {
            const supportedDecisions = decisions.filter(d => plugin.supports(d));
            if (supportedDecisions.length > 0) {
                try {
                    const pluginActions = plugin.plan(supportedDecisions);
                    actions.push(...pluginActions);
                }
                catch (e) {
                    // One plugin failure should not stop the stabilization pipeline
                }
            }
        }
        // Resolve conflicts and order execution
        const resolvedActions = this.resolveConflicts(actions);
        // Sort by priority (highest first)
        resolvedActions.sort((a, b) => b.priority - a.priority);
        return resolvedActions;
    }
    resolveConflicts(actions) {
        const finalMap = new Map();
        for (const action of actions) {
            const key = `${action.selector}-${action.strategy}`; // Allow multiple strategies on same selector if they don't strictly conflict (e.g., blur + pointer-events none)
            if (!finalMap.has(key)) {
                finalMap.set(key, action);
            }
            else {
                // If conflict on same selector and strategy, keep the one with higher priority
                const existing = finalMap.get(key);
                if (action.priority > existing.priority) {
                    finalMap.set(key, action);
                }
            }
        }
        // Advanced logic: if one plugin wants to Replace and another wants to Mask the same element, Priority wins.
        const dedupedBySelector = new Map();
        for (const action of finalMap.values()) {
            if (!dedupedBySelector.has(action.selector)) {
                dedupedBySelector.set(action.selector, action);
            }
            else {
                const existing = dedupedBySelector.get(action.selector);
                if (action.priority > existing.priority) {
                    dedupedBySelector.set(action.selector, action);
                }
            }
        }
        return Array.from(dedupedBySelector.values());
    }
}
exports.StabilizationPlanner = StabilizationPlanner;
//# sourceMappingURL=planner.js.map