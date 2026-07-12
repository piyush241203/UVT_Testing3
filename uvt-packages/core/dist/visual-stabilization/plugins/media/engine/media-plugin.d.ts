import { StabilizationPlugin, PluginPriority, StabilizationAction } from '../../../models/models.js';
import { MediaConfig } from '../models/models.js';
import { Decision } from '../../../../dynamic-decision/index.js';
export declare class MediaStabilizationPlugin implements StabilizationPlugin {
    readonly id = "MediaStabilizationPlugin";
    readonly priority = PluginPriority.High;
    private planner;
    private subPlugins;
    constructor(config?: Partial<MediaConfig>);
    initialize(): void;
    dispose(): void;
    supports(decision: Decision): boolean;
    plan(decisions: Decision[]): StabilizationAction[];
}
//# sourceMappingURL=media-plugin.d.ts.map