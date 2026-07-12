import { Page } from 'playwright';
import { Decision } from '../../dynamic-decision/index.js';
import { VerificationResult } from '../models/models.js';
export interface StabilizationMetadata {
    pluginsLoaded: number;
    actionsPlanned: number;
    verification: VerificationResult;
    executionTimeMs: number;
}
export declare class VisualStabilizationEngine {
    private registry;
    private planner;
    constructor();
    stabilize(page: Page, decisions: Decision[]): Promise<StabilizationMetadata>;
}
//# sourceMappingURL=engine.d.ts.map