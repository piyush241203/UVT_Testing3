import { TCSEPlugin, TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
export interface RawAdCandidate {
    selector: string;
    tagName: string;
    id: string;
    className: string;
    src?: string;
    ariaLabel?: string;
    role?: string;
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    matchedSources: Array<{
        source: string;
        weight: number;
        detail: string;
        vendor?: string;
    }>;
}
export declare class AdDetectionPlugin implements TCSEPlugin {
    readonly name = "AdDetectionPlugin";
    readonly version = "1.0.0";
    enabled: boolean;
    initialize(context: TCSEContext): Promise<void>;
    detect(context: TCSEContext): Promise<TCSESignal[]>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=ad-detection-plugin.d.ts.map