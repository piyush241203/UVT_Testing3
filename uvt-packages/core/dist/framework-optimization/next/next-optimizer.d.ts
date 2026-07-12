import { DynamicContext } from '../../dynamic-engine/index.js';
import { Decision } from '../../dynamic-decision/index.js';
import { FrameworkOptimizer, OptimizedDecision } from '../models/models.js';
export declare class NextOptimizer implements FrameworkOptimizer {
    readonly id = "NextOptimizer";
    supports(context: DynamicContext): boolean;
    optimize(decisions: Decision[], context: DynamicContext): OptimizedDecision[];
    verify(): void;
    dispose(): void;
}
//# sourceMappingURL=next-optimizer.d.ts.map