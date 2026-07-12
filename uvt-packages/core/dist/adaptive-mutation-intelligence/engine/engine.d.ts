import { Page } from 'playwright';
import { MutationMetadata } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
export interface AMIEResult {
    metadata: MutationMetadata;
    signals: DynamicSignal[];
}
export declare class AdaptiveMutationIntelligenceEngine {
    private cache;
    observe(page: Page, mode?: 'fast' | 'balanced' | 'strict'): Promise<AMIEResult>;
}
//# sourceMappingURL=engine.d.ts.map