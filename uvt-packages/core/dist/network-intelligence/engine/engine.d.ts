import { Page } from 'playwright';
import { NetworkMetadata } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
export declare class SemanticNetworkIntelligenceEngine {
    private cache;
    private protocols;
    private interceptor?;
    signals: DynamicSignal[];
    private endpoints;
    constructor();
    attach(page: Page): void;
    detach(): void;
    getMetadata(): NetworkMetadata;
}
//# sourceMappingURL=engine.d.ts.map