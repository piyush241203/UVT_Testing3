import { ReadinessConfig, VisualReadyResult } from '../models/models.js';
import { ReadinessCondition } from '../conditions/condition.js';
export declare class ReadinessCoordinator {
    private config;
    private conditions;
    constructor(config: ReadinessConfig, conditions: ReadinessCondition[]);
    waitForReadiness(page: any): Promise<VisualReadyResult>;
}
//# sourceMappingURL=readiness-coordinator.d.ts.map