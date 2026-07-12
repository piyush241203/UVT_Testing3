"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationEngine = void 0;
class VerificationEngine {
    static verify(executorResult, plannedActions) {
        const success = executorResult?.success ?? false;
        const actionsApplied = executorResult?.actionsApplied ?? 0;
        const actionsFailed = executorResult?.actionsFailed ?? 0;
        const errors = executorResult?.errors ?? [];
        if (actionsFailed > 0) {
            errors.push(`Failed to apply ${actionsFailed} stabilization actions.`);
        }
        return {
            success,
            actionsApplied,
            actionsFailed,
            errors
        };
    }
}
exports.VerificationEngine = VerificationEngine;
//# sourceMappingURL=verification.js.map