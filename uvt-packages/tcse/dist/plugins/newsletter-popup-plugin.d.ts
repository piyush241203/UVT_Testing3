import { BaseTCSEPlugin } from './base-plugin.js';
import { TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
export declare class NewsletterPopupPlugin extends BaseTCSEPlugin {
    readonly name = "NewsletterPopupPlugin";
    detect(context: TCSEContext): Promise<TCSESignal[]>;
}
//# sourceMappingURL=newsletter-popup-plugin.d.ts.map