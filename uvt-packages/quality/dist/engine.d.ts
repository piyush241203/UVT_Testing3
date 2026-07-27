import { AutomationQualityReport } from './types.js';
export interface QualityAnalysisInput {
    cwd?: string;
    frameworkName?: string;
    frameworkConfidence?: number;
    routeCount?: number;
    routingStrategy?: string;
    env?: Record<string, string | undefined>;
}
export declare class AutomationQualityEngine {
    private healthAnalyzer;
    private confidenceCalculator;
    constructor();
    evaluate(input?: QualityAnalysisInput): AutomationQualityReport;
    private evaluateGeneratorAccuracy;
    private evaluateCIAccuracy;
    private evaluateArtifactAccuracy;
    private evaluateAutomationCompleteness;
}
//# sourceMappingURL=engine.d.ts.map