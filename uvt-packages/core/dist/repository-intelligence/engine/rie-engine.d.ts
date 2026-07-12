import { RepositoryScanResult } from '../models/models.js';
export declare class RepositoryIntelligenceEngine {
    private cache;
    private detectors;
    constructor(cwd: string);
    scan(cwd: string, force?: boolean): Promise<RepositoryScanResult>;
}
//# sourceMappingURL=rie-engine.d.ts.map