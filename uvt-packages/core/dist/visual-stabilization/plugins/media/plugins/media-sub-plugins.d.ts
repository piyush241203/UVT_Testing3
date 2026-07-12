import { DynamicSignal } from '../../../../dynamic-engine/index.js';
import { StabilizationAction } from '../../../models/models.js';
import { MediaConfig } from '../models/models.js';
export interface MediaSubPlugin {
    supports(signal: DynamicSignal): boolean;
    plan(signal: DynamicSignal, config: MediaConfig, pluginId: string): StabilizationAction[];
}
export declare class ImageSubPlugin implements MediaSubPlugin {
    supports(s: DynamicSignal): boolean;
    plan(s: DynamicSignal, c: MediaConfig, id: string): StabilizationAction[];
}
export declare class AvatarSubPlugin implements MediaSubPlugin {
    supports(s: DynamicSignal): boolean;
    plan(s: DynamicSignal, c: MediaConfig, id: string): StabilizationAction[];
}
export declare class CanvasSubPlugin implements MediaSubPlugin {
    supports(s: DynamicSignal): boolean;
    plan(s: DynamicSignal, c: MediaConfig, id: string): StabilizationAction[];
}
export declare class SVGSubPlugin implements MediaSubPlugin {
    supports(s: DynamicSignal): boolean;
    plan(s: DynamicSignal, c: MediaConfig, id: string): StabilizationAction[];
}
export declare class VideoSubPlugin implements MediaSubPlugin {
    supports(s: DynamicSignal): boolean;
    plan(s: DynamicSignal, c: MediaConfig, id: string): StabilizationAction[];
}
export declare class AudioSubPlugin implements MediaSubPlugin {
    supports(s: DynamicSignal): boolean;
    plan(s: DynamicSignal, c: MediaConfig, id: string): StabilizationAction[];
}
export declare class GIFSubPlugin implements MediaSubPlugin {
    supports(s: DynamicSignal): boolean;
    plan(s: DynamicSignal, c: MediaConfig, id: string): StabilizationAction[];
}
export declare class LottieSubPlugin implements MediaSubPlugin {
    supports(s: DynamicSignal): boolean;
    plan(s: DynamicSignal, c: MediaConfig, id: string): StabilizationAction[];
}
export declare class BackgroundSubPlugin implements MediaSubPlugin {
    supports(s: DynamicSignal): boolean;
    plan(s: DynamicSignal, c: MediaConfig, id: string): StabilizationAction[];
}
export declare const getMediaSubPlugins: () => MediaSubPlugin[];
//# sourceMappingURL=media-sub-plugins.d.ts.map