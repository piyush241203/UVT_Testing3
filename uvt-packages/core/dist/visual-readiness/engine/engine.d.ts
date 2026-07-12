import { ReadinessConfig, VisualReadyResult } from '../models/models.js';
export declare class VisualReadinessEngine {
    private config;
    private coordinator;
    constructor(config?: Partial<ReadinessConfig>);
    checkReadiness(page: any): Promise<VisualReadyResult>;
}
//# sourceMappingURL=engine.d.ts.map