import { DynamicContext } from '../../dynamic-engine/index.js';
import { Decision } from '../../dynamic-decision/index.js';
import { FrameworkOptimizer, OptimizedDecision } from '../models/models.js';
export declare class ReactOptimizer implements FrameworkOptimizer {
    readonly id = "ReactOptimizer";
    supports(context: DynamicContext): boolean;
    optimize(decisions: Decision[], context: DynamicContext): OptimizedDecision[];
    verify(): void;
    dispose(): void;
}
//# sourceMappingURL=react-optimizer.d.ts.map