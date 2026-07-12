import { Page } from 'playwright';
import { DOMMetadata } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
export interface RDIEResult {
    metadata: DOMMetadata;
    signals: DynamicSignal[];
}
export declare class RuntimeDOMIntelligenceEngine {
    private cache;
    private classifiers;
    constructor();
    scan(page: Page): Promise<RDIEResult>;
}
//# sourceMappingURL=engine.d.ts.map