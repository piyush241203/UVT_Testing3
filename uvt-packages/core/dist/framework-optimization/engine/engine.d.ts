import { DynamicContext } from '../../dynamic-engine/index.js';
import { Decision } from '../../dynamic-decision/index.js';
import { OptimizedDecision, FrameworkOptimizationConfig } from '../models/models.js';
export declare class FrameworkOptimizationEngine {
    private config;
    private registry;
    constructor(config?: Partial<FrameworkOptimizationConfig>);
    optimize(decisions: Decision[], context: DynamicContext): OptimizedDecision[];
    private mergeDecisions;
}
//# sourceMappingURL=engine.d.ts.map