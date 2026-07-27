import { BaseTCSEPlugin } from './base-plugin.js';
import { TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
export declare class ChatWidgetPlugin extends BaseTCSEPlugin {
    readonly name = "ChatWidgetPlugin";
    detect(context: TCSEContext): Promise<TCSESignal[]>;
}
//# sourceMappingURL=chat-widget-plugin.d.ts.map