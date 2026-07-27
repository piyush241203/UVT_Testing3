import { BaseTCSEPlugin } from './base-plugin.js';
import { TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
export declare class CookieBannerPlugin extends BaseTCSEPlugin {
    readonly name = "CookieBannerPlugin";
    detect(context: TCSEContext): Promise<TCSESignal[]>;
}
//# sourceMappingURL=cookie-banner-plugin.d.ts.map