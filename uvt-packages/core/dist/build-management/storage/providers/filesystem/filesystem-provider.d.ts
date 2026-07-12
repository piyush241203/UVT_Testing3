import { StorageProvider } from '../storage-provider.js';
import { Build, Snapshot, Baseline } from '../../../models/models.js';
export declare class FilesystemProvider implements StorageProvider {
    private baseDir;
    constructor(cwd: string);
    private ensureDirs;
    private readJson;
    private writeJson;
    saveBuild(build: Build): Promise<void>;
    getBuild(buildId: string): Promise<Build | null>;
    listBuilds(repositoryId: string): Promise<Build[]>;
    saveSnapshot(snapshot: Snapshot): Promise<void>;
    getSnapshot(snapshotId: string): Promise<Snapshot | null>;
    saveBaseline(baseline: Baseline): Promise<void>;
    getBaseline(branch: string, regionId: string): Promise<Baseline | null>;
    listBaselines(branch: string): Promise<Baseline[]>;
}
//# sourceMappingURL=filesystem-provider.d.ts.map