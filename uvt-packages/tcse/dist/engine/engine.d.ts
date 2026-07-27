import { TCSEContext, TCSEProcessResult } from '../contracts/index.js';
import { TCSERegistry } from '../registry/registry.js';
import { TCSEDecision } from '../models/decision.js';
import { TCSEConfidenceModel } from '../models/confidence.js';
export declare class TCSEEngine {
    private registry;
    private confidenceModel;
    constructor(registry?: TCSERegistry, confidenceModel?: TCSEConfidenceModel);
    getRegistry(): TCSERegistry;
    getConfidenceModel(): TCSEConfidenceModel;
    /**
     * Main entry point to run Third-Party Content Stabilization Engine processing.
     * If zero plugins are registered or enabled, returns a zero-op result immediately.
     */
    process(context?: TCSEContext): Promise<TCSEProcessResult>;
    /**
     * Applies generated stabilization decisions onto page if page context is present.
     */
    stabilize(context: TCSEContext, decisions: TCSEDecision[]): Promise<number>;
}
//# sourceMappingURL=engine.d.ts.map