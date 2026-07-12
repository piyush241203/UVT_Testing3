export interface CompatibilityTarget {
    id: string;
    name: string;
    framework: string;
    libraries: string[];
    repoUrl?: string;
    mockTelemetry?: {
        accuracy: number;
        stabilizationSuccess: number;
        falsePositiveRate: number;
        executionTimeMs: number;
        memoryUsageMb: number;
    };
}
export interface CompatibilityScore {
    targetId: string;
    framework: string;
    score: number;
    accuracy: number;
    stabilizationSuccess: number;
    falsePositiveRate: number;
    executionTimeMs: number;
}
export interface CompatibilityReport {
    timestamp: string;
    overallScore: number;
    frameworkScores: Record<string, number>;
    targets: CompatibilityScore[];
}
export interface RegressionAlert {
    metric: string;
    targetId: string;
    previousValue: number;
    currentValue: number;
    degradationPercentage: number;
}
//# sourceMappingURL=models.d.ts.map