"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseGatekeeper = void 0;
const compatibility_1 = require("@uvt/compatibility");
class ReleaseGatekeeper {
    async verifyGates() {
        const runner = new compatibility_1.CompatibilityRunner();
        const report = await runner.runMatrix();
        if (report.overallScore < 98) {
            throw new Error(`[GATEKEEPER] Release rejected. Compatibility score ${report.overallScore}% is below the 98% threshold.`);
        }
        const averageTime = report.targets.reduce((acc, target) => acc + target.executionTimeMs, 0) / report.targets.length;
        if (averageTime > 2000) {
            throw new Error(`[GATEKEEPER] Release rejected. Matrix execution time (${averageTime}ms) exceeded 2000ms SLA.`);
        }
        return true;
    }
}
exports.ReleaseGatekeeper = ReleaseGatekeeper;
//# sourceMappingURL=gatekeeper.js.map