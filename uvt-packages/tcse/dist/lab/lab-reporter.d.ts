import { ScenarioCertificationResult } from './lab-runner.js';
export interface TCSELabSummary {
    totalScenarios: number;
    passedScenarios: number;
    failedScenarios: number;
    overallScore: number;
    averageCls: number;
    unapprovedDomMutations: number;
    groupScores: {
        group: string;
        count: number;
        passed: number;
        avgScore: number;
    }[];
    results: ScenarioCertificationResult[];
    timestamp: number;
}
export declare class TCSELabReporter {
    compileLabSummary(results: ScenarioCertificationResult[]): TCSELabSummary;
    renderConsole(summary: TCSELabSummary): string;
    renderMarkdown(summary: TCSELabSummary): string;
    renderHTML(summary: TCSELabSummary): string;
    saveLabReports(summary: TCSELabSummary, outputDir?: string): {
        htmlPath: string;
        mdPath: string;
        jsonPath: string;
    };
}
//# sourceMappingURL=lab-reporter.d.ts.map