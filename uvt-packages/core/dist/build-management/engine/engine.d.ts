import { BuildManager } from '../builds/build-manager.js';
import { BaselineManager } from '../baselines/baseline-manager.js';
import { StorageProvider } from '../storage/providers/storage-provider.js';
export declare class UBMSEngine {
    storage: StorageProvider;
    builds: BuildManager;
    baselines: BaselineManager;
    constructor(cwd: string);
}
//# sourceMappingURL=engine.d.ts.map