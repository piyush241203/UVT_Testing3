import { DiagnosticReport, RepairResult } from '../models/models.js';
export declare class OnboardingEngine {
    private doctor;
    private repairEngine;
    private generator;
    initProject(cwd: string, detectedFramework?: string): Promise<boolean>;
    runDiagnostics(cwd: string): Promise<DiagnosticReport>;
    runRepair(cwd: string): Promise<RepairResult>;
    explainDecision(traceFile: string): Promise<string>;
}
//# sourceMappingURL=engine.d.ts.map