export interface QualityConfig {
    enabled: boolean;
    minimumScore: number;
    evaluatePluginEffectiveness: boolean;
    detectOverStabilization: boolean;
    detectUnderStabilization: boolean;
    sendFeedbackToKnowledgeEngine: boolean;
}
export declare const DEFAULT_QUALITY_CONFIG: QualityConfig;
export interface PluginEffectiveness {
    pluginId: string;
    executions: number;
    successes: number;
    failures: number;
    rollbacks: number;
    averageExecutionTimeMs: number;
    confidence: number;
    regionsAffected: number;
}
export interface QualityHeuristic {
    id: string;
    type: 'OverStabilization' | 'UnderStabilization' | 'Optimal';
    description: string;
    severity: 'Low' | 'Medium' | 'High';
}
export interface VisualQualityReport {
    score: number;
    falsePositiveRisk: 'Low' | 'Medium' | 'High';
    regressionCoverage: number;
    stabilizationEfficiency: number;
    pluginStatistics: PluginEffectiveness[];
    heuristics: QualityHeuristic[];
    recommendations: string[];
    warnings: string[];
}
//# sourceMappingURL=models.d.ts.map