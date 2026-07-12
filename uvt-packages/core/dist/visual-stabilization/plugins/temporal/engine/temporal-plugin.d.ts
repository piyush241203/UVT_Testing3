import { StabilizationPlugin, PluginPriority, StabilizationAction } from '../../../models/models.js';
import { TemporalConfig } from '../models/models.js';
import { Decision } from '../../../../dynamic-decision/index.js';
export declare class TemporalStabilizationPlugin implements StabilizationPlugin {
    readonly id = "TemporalStabilizationPlugin";
    readonly priority = PluginPriority.High;
    private planner;
    constructor(config?: Partial<TemporalConfig>);
    initialize(): void;
    dispose(): void;
    supports(decision: Decision): boolean;
    plan(decisions: Decision[]): StabilizationAction[];
}
//# sourceMappingURL=temporal-plugin.d.ts.map