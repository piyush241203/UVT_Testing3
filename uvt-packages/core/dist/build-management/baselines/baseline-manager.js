"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaselineManager = void 0;
class BaselineManager {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    async promoteSnapshot(snapshotId, branch, commit) {
        const baseline = {
            baselineId: `base-${Date.now()}`,
            branch,
            commit,
            snapshotId,
            status: 'Promoted',
            createdAt: new Date().toISOString()
        };
        await this.storage.saveBaseline(baseline);
        return baseline;
    }
    async getActiveBaseline(branch, regionId, fallbackBranch = 'main') {
        let baseline = await this.storage.getBaseline(branch, regionId);
        if (!baseline && fallbackBranch && branch !== fallbackBranch) {
            baseline = await this.storage.getBaseline(fallbackBranch, regionId);
        }
        return baseline;
    }
}
exports.BaselineManager = BaselineManager;
//# sourceMappingURL=baseline-manager.js.map