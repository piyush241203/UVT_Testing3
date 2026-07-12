"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegressionEngine = void 0;
class RegressionEngine {
    detectRegressions(current, previous) {
        const alerts = [];
        for (const currentTarget of current.targets) {
            const prevTarget = previous.targets.find(t => t.targetId === currentTarget.targetId);
            if (!prevTarget)
                continue;
            if (currentTarget.score < prevTarget.score - 1) {
                alerts.push({
                    metric: 'Compatibility Score',
                    targetId: currentTarget.targetId,
                    previousValue: prevTarget.score,
                    currentValue: currentTarget.score,
                    degradationPercentage: ((prevTarget.score - currentTarget.score) / prevTarget.score) * 100
                });
            }
            if (currentTarget.executionTimeMs > prevTarget.executionTimeMs * 1.2) {
                alerts.push({
                    metric: 'Execution Time',
                    targetId: currentTarget.targetId,
                    previousValue: prevTarget.executionTimeMs,
                    currentValue: currentTarget.executionTimeMs,
                    degradationPercentage: ((currentTarget.executionTimeMs - prevTarget.executionTimeMs) / prevTarget.executionTimeMs) * 100
                });
            }
        }
        return alerts;
    }
}
exports.RegressionEngine = RegressionEngine;
//# sourceMappingURL=regression-engine.js.map