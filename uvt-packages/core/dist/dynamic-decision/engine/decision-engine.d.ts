import { DynamicSignal } from '../../dynamic-engine/index.js';
import { Decision, DecisionConfig } from '../models/models.js';
export declare class DynamicDecisionEngine {
    private config;
    private correlationEngine;
    private confidenceCalculator;
    private conflictResolver;
    constructor(config?: Partial<DecisionConfig>);
    evaluate(signals: DynamicSignal[]): Decision[];
}
//# sourceMappingURL=decision-engine.d.ts.map