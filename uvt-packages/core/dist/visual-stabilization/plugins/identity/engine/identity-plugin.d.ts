import { StabilizationPlugin, PluginPriority, StabilizationAction } from '../../../models/models.js';
import { IdentityConfig } from '../models/models.js';
import { Decision } from '../../../../dynamic-decision/index.js';
export declare class IdentityStabilizationPlugin implements StabilizationPlugin {
    readonly id = "IdentityStabilizationPlugin";
    readonly priority = PluginPriority.Critical;
    private planner;
    constructor(config?: Partial<IdentityConfig>);
    initialize(): void;
    dispose(): void;
    supports(decision: Decision): boolean;
    plan(decisions: Decision[]): StabilizationAction[];
}
//# sourceMappingURL=identity-plugin.d.ts.map