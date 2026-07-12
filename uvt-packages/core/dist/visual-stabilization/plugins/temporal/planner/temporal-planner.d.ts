import { DynamicSignal } from '../../../../dynamic-engine/index.js';
import { StabilizationAction } from '../../../models/models.js';
import { TemporalConfig } from '../models/models.js';
export declare class TemporalPlanner {
    private config;
    constructor(config?: Partial<TemporalConfig>);
    plan(signals: DynamicSignal[], pluginId: string): StabilizationAction[];
}
//# sourceMappingURL=temporal-planner.d.ts.map