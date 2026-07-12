import { StabilizationAction, StabilizationPlugin } from '../models/models.js';
import { Decision } from '../../dynamic-decision/index.js';
export declare class StabilizationPlanner {
    plan(decisions: Decision[], plugins: StabilizationPlugin[]): StabilizationAction[];
    private resolveConflicts;
}
//# sourceMappingURL=planner.d.ts.map