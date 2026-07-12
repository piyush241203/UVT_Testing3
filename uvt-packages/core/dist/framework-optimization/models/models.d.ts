import { DynamicContext } from '../../dynamic-engine/index.js';
import { Decision } from '../../dynamic-decision/index.js';
export interface OptimizedDecision extends Decision {
    optimizedStrategy?: string;
    isOptimized: boolean;
    framework?: string;
}
export interface FrameworkOptimizationConfig {
    enabled: boolean;
    preferNativeFrameworkHooks: boolean;
    mergeCompatibleDecisions: boolean;
    optimizeExecutionOrder: boolean;
}
export declare const DEFAULT_FOE_CONFIG: FrameworkOptimizationConfig;
export interface FrameworkOptimizer {
    readonly id: string;
    supports(context: DynamicContext): boolean;
    optimize(decisions: Decision[], context: DynamicContext): OptimizedDecision[];
    verify(): void;
    dispose(): void;
}
//# sourceMappingURL=models.d.ts.map