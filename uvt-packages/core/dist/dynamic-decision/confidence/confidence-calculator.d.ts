import { DynamicSignal } from '../../dynamic-engine/index.js';
import { DecisionConfig } from '../models/models.js';
export declare class ConfidenceCalculator {
    private config;
    constructor(config: DecisionConfig);
    calculate(signals: DynamicSignal[]): number;
}
//# sourceMappingURL=confidence-calculator.d.ts.map