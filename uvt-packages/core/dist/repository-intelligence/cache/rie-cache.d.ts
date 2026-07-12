import { RepositoryScanResult } from '../models/models.js';
export declare class RIECache {
    private cacheDir;
    constructor(cwd: string);
    private generateFingerprint;
    get(cwd: string): RepositoryScanResult | null;
    set(cwd: string, result: RepositoryScanResult): void;
}
//# sourceMappingURL=rie-cache.d.ts.map