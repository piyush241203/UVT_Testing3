import { Decision } from '../../dynamic-decision/index.js';
export type StabilizationStrategy = 'Mask' | 'Hide' | 'Remove' | 'Replace' | 'Freeze' | 'Mock' | 'Clone' | 'Skip' | 'Ignore' | 'ReplaceSrc' | 'PauseMedia' | 'PauseRenderLoop' | 'FreezeCanvas' | 'RasterizeCanvas';
export declare enum PluginPriority {
    Critical = 4,
    High = 3,
    Normal = 2,
    Low = 1
}
export interface StabilizationAction {
    pluginId: string;
    selector: string;
    strategy: StabilizationStrategy;
    priority: PluginPriority;
    value?: string;
    reason: string;
}
export interface VerificationResult {
    success: boolean;
    actionsApplied: number;
    actionsFailed: number;
    errors: string[];
}
export interface StabilizationPlugin {
    readonly id: string;
    readonly priority: PluginPriority;
    initialize(): void;
    supports(decision: Decision): boolean;
    plan(decisions: Decision[]): StabilizationAction[];
    dispose(): void;
}
//# sourceMappingURL=models.d.ts.map