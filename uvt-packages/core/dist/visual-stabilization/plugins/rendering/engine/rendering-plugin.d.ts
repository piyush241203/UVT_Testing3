import { StabilizationPlugin, PluginPriority, StabilizationAction } from '../../../models/models.js';
import { RenderingConfig } from '../models/models.js';
import { Decision } from '../../../../dynamic-decision/index.js';
export declare class RenderingStabilizationPlugin implements StabilizationPlugin {
    readonly id = "RenderingStabilizationPlugin";
    readonly priority = PluginPriority.High;
    private planner;
    constructor(config?: Partial<RenderingConfig>);
    initialize(): void;
    dispose(): void;
    supports(decision: Decision): boolean;
    plan(decisions: Decision[]): StabilizationAction[];
}
//# sourceMappingURL=rendering-plugin.d.ts.map