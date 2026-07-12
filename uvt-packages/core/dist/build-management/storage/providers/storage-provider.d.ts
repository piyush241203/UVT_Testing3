import { Build, Snapshot, Baseline } from '../../models/models.js';
export interface StorageProvider {
    saveBuild(build: Build): Promise<void>;
    getBuild(buildId: string): Promise<Build | null>;
    listBuilds(repositoryId: string): Promise<Build[]>;
    saveSnapshot(snapshot: Snapshot): Promise<void>;
    getSnapshot(snapshotId: string): Promise<Snapshot | null>;
    saveBaseline(baseline: Baseline): Promise<void>;
    getBaseline(branch: string, regionId: string): Promise<Baseline | null>;
    listBaselines(branch: string): Promise<Baseline[]>;
}
//# sourceMappingURL=storage-provider.d.ts.map