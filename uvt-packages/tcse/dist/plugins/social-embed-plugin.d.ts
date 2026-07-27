import { BaseTCSEPlugin } from './base-plugin.js';
import { TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
export declare class SocialEmbedPlugin extends BaseTCSEPlugin {
    readonly name = "SocialEmbedPlugin";
    detect(context: TCSEContext): Promise<TCSESignal[]>;
}
//# sourceMappingURL=social-embed-plugin.d.ts.map