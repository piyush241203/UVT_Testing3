import { StabilizationPlugin, PluginPriority, StabilizationAction } from '../models/models.js';
import { Decision } from '../../dynamic-decision/index.js';
declare abstract class BasePlugin implements StabilizationPlugin {
    readonly id: string;
    readonly priority: PluginPriority;
    constructor(id: string, priority: PluginPriority);
    initialize(): void;
    dispose(): void;
    abstract supports(decision: Decision): boolean;
    abstract plan(decisions: Decision[]): StabilizationAction[];
}
export declare class CSSPlugin extends BasePlugin {
    constructor();
    supports(d: Decision): boolean;
    plan(decisions: Decision[]): never[];
}
export declare class FormPlugin extends BasePlugin {
    constructor();
    supports(d: Decision): boolean;
    plan(decisions: Decision[]): never[];
}
export declare class RealtimePlugin extends BasePlugin {
    constructor();
    supports(d: Decision): boolean;
    plan(decisions: Decision[]): never[];
}
export declare class NotificationPlugin extends BasePlugin {
    constructor();
    supports(d: Decision): boolean;
    plan(decisions: Decision[]): never[];
}
export declare class LiveRegionPlugin extends BasePlugin {
    constructor();
    supports(d: Decision): boolean;
    plan(decisions: Decision[]): never[];
}
export declare class SkeletonPlugin extends BasePlugin {
    constructor();
    supports(d: Decision): boolean;
    plan(decisions: Decision[]): never[];
}
export declare class CarouselPlugin extends BasePlugin {
    constructor();
    supports(d: Decision): boolean;
    plan(decisions: Decision[]): never[];
}
export declare class CustomPlugin extends BasePlugin {
    constructor();
    supports(d: Decision): boolean;
    plan(decisions: Decision[]): never[];
}
export declare const getAllPlugins: () => StabilizationPlugin[];
export {};
//# sourceMappingURL=core-plugins.d.ts.map