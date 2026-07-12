import { DynamicSignal } from '../../../../dynamic-engine/index.js';
import { StabilizationAction } from '../../../models/models.js';
import { IdentityConfig } from '../models/models.js';
export declare class IdentityPlanner {
    private config;
    constructor(config?: Partial<IdentityConfig>);
    plan(signals: DynamicSignal[], pluginId: string): StabilizationAction[];
}
//# sourceMappingURL=identity-planner.d.ts.map