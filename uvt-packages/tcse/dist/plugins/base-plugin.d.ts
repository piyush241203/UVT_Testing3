import { TCSEPlugin, TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
import { TCSEDecision } from '../models/decision.js';
export declare abstract class BaseTCSEPlugin implements TCSEPlugin {
    abstract readonly name: string;
    readonly version: string;
    enabled: boolean;
    initialize(context: TCSEContext): Promise<void>;
    detect(context: TCSEContext): Promise<TCSESignal[]>;
    evaluate?(signals: TCSESignal[], context: TCSEContext): Promise<TCSEDecision[]>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=base-plugin.d.ts.map