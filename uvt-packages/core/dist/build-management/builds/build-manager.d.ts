import { StorageProvider } from '../storage/providers/storage-provider.js';
import { Build, Snapshot } from '../models/models.js';
export declare class BuildManager {
    private storage;
    constructor(storage: StorageProvider);
    startBuild(repoId: string, branch: string, commit: string): Promise<Build>;
    finalizeBuild(buildId: string, snapshots: Snapshot[], durationMs: number): Promise<Build>;
}
//# sourceMappingURL=build-manager.d.ts.map