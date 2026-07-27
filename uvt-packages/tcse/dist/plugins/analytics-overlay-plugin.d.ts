import { BaseTCSEPlugin } from './base-plugin.js';
import { TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
export declare class AnalyticsOverlayPlugin extends BaseTCSEPlugin {
    readonly name = "AnalyticsOverlayPlugin";
    detect(context: TCSEContext): Promise<TCSESignal[]>;
}
//# sourceMappingURL=analytics-overlay-plugin.d.ts.map