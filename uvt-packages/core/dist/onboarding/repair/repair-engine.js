"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairEngine = void 0;
class RepairEngine {
    async repair(issues) {
        const fixed = [];
        const failed = [];
        for (const issue of issues) {
            if (issue.canAutoRepair) {
                // e.g. execute playwright install
                fixed.push(issue.id);
            }
            else {
                failed.push(issue.id);
            }
        }
        return {
            success: failed.length === 0,
            fixedIssues: fixed,
            failedIssues: failed
        };
    }
}
exports.RepairEngine = RepairEngine;
//# sourceMappingURL=repair-engine.js.map