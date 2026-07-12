import { DynamicSignal } from '../../../../dynamic-engine/index.js';
import { StabilizationAction } from '../../../models/models.js';
import { RenderingConfig } from '../models/models.js';
import { RenderingAdapter } from '../planner/rendering-planner.js';
export declare class WebGLAdapter implements RenderingAdapter {
    supports(signal: DynamicSignal): boolean;
    plan(signal: DynamicSignal, config: RenderingConfig, pluginId: string): StabilizationAction[];
}
//# sourceMappingURL=webgl-adapters.d.ts.map