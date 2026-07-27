import { BaseTCSEPlugin } from './base-plugin.js';
import { TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
export declare class RecommendationWidgetPlugin extends BaseTCSEPlugin {
    readonly name = "RecommendationWidgetPlugin";
    detect(context: TCSEContext): Promise<TCSESignal[]>;
}
//# sourceMappingURL=recommendation-widget-plugin.d.ts.map