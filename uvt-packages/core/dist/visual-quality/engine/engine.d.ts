import { DynamicContext } from '../../dynamic-engine/index.js';
import { QualityConfig, VisualQualityReport } from '../models/models.js';
export declare class VisualQualityEngine {
    private config;
    private scoring;
    private heuristics;
    constructor(config?: Partial<QualityConfig>);
    evaluate(context: DynamicContext, vseMetadata: any): Promise<VisualQualityReport | null>;
}
//# sourceMappingURL=engine.d.ts.map