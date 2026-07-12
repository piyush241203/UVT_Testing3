import { StorageProvider } from '../storage/providers/storage-provider.js';
import { Baseline } from '../models/models.js';
export declare class BaselineManager {
    private storage;
    constructor(storage: StorageProvider);
    promoteSnapshot(snapshotId: string, branch: string, commit: string): Promise<Baseline>;
    getActiveBaseline(branch: string, regionId: string, fallbackBranch?: string): Promise<Baseline | null>;
}
//# sourceMappingURL=baseline-manager.d.ts.map