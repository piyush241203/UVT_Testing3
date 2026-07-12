export interface DiagnosticReport {
    isHealthy: boolean;
    issues: DiagnosticIssue[];
    recommendations: string[];
}
export interface DiagnosticIssue {
    id: string;
    description: string;
    severity: 'Warning' | 'Error';
    canAutoRepair: boolean;
}
export interface RepairResult {
    success: boolean;
    fixedIssues: string[];
    failedIssues: string[];
}
export interface OnboardingConfig {
    autoInstallBrowsers: boolean;
    createMissingConfig: boolean;
    strictValidation: boolean;
}
//# sourceMappingURL=models.d.ts.map