import { DynamicSignal } from '../../../../dynamic-engine/index.js';
import { StabilizationAction } from '../../../models/models.js';
import { MediaConfig } from '../models/models.js';
export declare class MediaPlanner {
    private config;
    private subPlugins;
    constructor(config: MediaConfig);
    plan(signals: DynamicSignal[], pluginId: string): StabilizationAction[];
}
//# sourceMappingURL=media-planner.d.ts.map