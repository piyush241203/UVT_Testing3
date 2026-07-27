import { BaseTCSEPlugin } from './base-plugin.js';
import { TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
export declare class ConsentManagerPlugin extends BaseTCSEPlugin {
    readonly name = "ConsentManagerPlugin";
    detect(context: TCSEContext): Promise<TCSESignal[]>;
}
//# sourceMappingURL=consent-manager-plugin.d.ts.map