import { FrameworkRegistry } from '../registry/registry.js';
import { FIECacheResult } from '../cache/cache.js';
export declare class FrameworkIntelligenceEngine {
    private registry;
    private cache;
    private cwd;
    constructor(cwd: string, registry: FrameworkRegistry);
    analyze(frameworkName: string, force?: boolean): Promise<FIECacheResult>;
}
//# sourceMappingURL=engine.d.ts.map