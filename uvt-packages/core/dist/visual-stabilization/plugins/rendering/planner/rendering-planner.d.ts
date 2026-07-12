import { DynamicSignal } from '../../../../dynamic-engine/index.js';
import { StabilizationAction } from '../../../models/models.js';
import { RenderingConfig } from '../models/models.js';
export interface RenderingAdapter {
    supports(signal: DynamicSignal): boolean;
    plan(signal: DynamicSignal, config: RenderingConfig, pluginId: string): StabilizationAction[];
}
export declare class RenderingPlanner {
    private config;
    private adapters;
    constructor(config: RenderingConfig);
    plan(signals: DynamicSignal[], pluginId: string): StabilizationAction[];
}
//# sourceMappingURL=rendering-planner.d.ts.map