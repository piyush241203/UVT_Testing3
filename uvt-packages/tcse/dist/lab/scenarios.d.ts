import { TCSESignalCategory } from '../models/signal.js';
import { TCSEActionMode } from '../models/decision.js';
export interface LabScenario {
    id: string;
    name: string;
    group: TCSESignalCategory;
    provider: string;
    elementMetadata: {
        tagName: string;
        id?: string;
        className?: string;
        ariaLabel?: string;
        src?: string;
        width?: number;
        height?: number;
    };
    expectedConfidence: number;
    expectedMode: TCSEActionMode;
}
export declare const TCSE_LAB_SCENARIOS: LabScenario[];
//# sourceMappingURL=scenarios.d.ts.map