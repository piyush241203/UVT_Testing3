export interface DiagnosticWarning {
    readonly id: string;
    readonly message: string;
    readonly component: string;
    readonly documentationUrl?: string;
}
export interface DiagnosticError {
    readonly id: string;
    readonly error: Error;
    readonly fatal: boolean;
    readonly component: string;
}
export interface DiagnosticRecommendation {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly fixCommand?: string;
}
export interface PerformanceDiagnostic {
    readonly metric: string;
    readonly valueMs: number;
    readonly thresholdMs: number;
    readonly degraded: boolean;
}
export interface SystemDiagnostics {
    readonly warnings: ReadonlyArray<DiagnosticWarning>;
    readonly errors: ReadonlyArray<DiagnosticError>;
    readonly recommendations: ReadonlyArray<DiagnosticRecommendation>;
    readonly performanceMetrics: ReadonlyArray<PerformanceDiagnostic>;
}
//# sourceMappingURL=model.d.ts.map