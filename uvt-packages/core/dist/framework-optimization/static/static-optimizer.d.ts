import { DynamicContext } from '../../dynamic-engine/index.js';
import { Decision } from '../../dynamic-decision/index.js';
import { FrameworkOptimizer, OptimizedDecision } from '../models/models.js';
export declare class StaticOptimizer implements FrameworkOptimizer {
    readonly id = "StaticOptimizer";
    supports(context: DynamicContext): boolean;
    optimize(decisions: Decision[], context: DynamicContext): OptimizedDecision[];
    verify(): void;
    dispose(): void;
}
//# sourceMappingURL=static-optimizer.d.ts.map