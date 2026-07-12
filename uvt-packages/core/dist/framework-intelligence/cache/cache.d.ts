import { DynamicSignal } from '../../dynamic-engine/index.js';
import { FrameworkMetadata } from '../models/models.js';
export interface FIECacheResult {
    signals: DynamicSignal[];
    metadata: Partial<FrameworkMetadata>;
}
export declare class FIECache {
    private cacheDir;
    constructor(cwd: string);
    private generateFingerprint;
    get(cwd: string): FIECacheResult | null;
    set(cwd: string, result: FIECacheResult): void;
}
//# sourceMappingURL=cache.d.ts.map