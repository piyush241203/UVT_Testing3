import { LabScenario } from './scenarios.js';
export interface PropertyCheck {
    propertyName: 'Detection' | 'Confidence' | 'Decision' | 'Layout Stability' | 'CLS' | 'Snapshot Stability' | 'Provider Upload';
    passed: boolean;
    actual: string | number;
    expected: string | number;
    notes?: string;
}
export interface ScenarioCertificationResult {
    scenarioId: string;
    scenarioName: string;
    group: string;
    provider: string;
    passed: boolean;
    score: number;
    propertyChecks: PropertyCheck[];
    cls: number;
    unapprovedDomMutations: number;
}
export declare class TCSELabRunner {
    private adPlugin;
    private aiClassifier;
    constructor();
    runFullLab(scenarios?: LabScenario[]): Promise<ScenarioCertificationResult[]>;
    certifyScenario(scenario: LabScenario): Promise<ScenarioCertificationResult>;
}
//# sourceMappingURL=lab-runner.d.ts.map