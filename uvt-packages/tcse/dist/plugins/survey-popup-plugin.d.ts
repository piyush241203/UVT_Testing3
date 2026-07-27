import { BaseTCSEPlugin } from './base-plugin.js';
import { TCSEContext } from '../contracts/index.js';
import { TCSESignal } from '../models/signal.js';
export declare class SurveyPopupPlugin extends BaseTCSEPlugin {
    readonly name = "SurveyPopupPlugin";
    detect(context: TCSEContext): Promise<TCSESignal[]>;
}
//# sourceMappingURL=survey-popup-plugin.d.ts.map