export type StressScenarioId = 'scale_100_routes' | 'scale_500_routes' | 'scale_1000_routes' | 'scale_10000_components' | 'nested_layouts' | 'large_monorepo' | 'deep_dependency_graph';
export type StressStatus = 'PASSED' | 'DEGRADED' | 'FAILED';
export interface StressMetrics {
    analysisTimeMs: number;
    memoryHeapUsedMb: number;
    memoryRssMb: number;
    cpuUserPercent: number;
    cpuSystemPercent: number;
    generatorSpeedSpecsPerSec: number;
    selectiveTestingEfficiencyMs: number;
    snapshotProcessingRatePerSec: number;
    routeCount: number;
    componentCount: number;
    layoutDepth: number;
}
export interface StressScenarioResult {
    id: StressScenarioId;
    name: string;
    description: string;
    status: StressStatus;
    metrics: StressMetrics;
    score: number;
    notes?: string[];
}
export interface StressCertificationReport {
    title: string;
    projectName: string;
    timestamp: string;
    overallStatus: StressStatus;
    overallScore: number;
    totalScenarios: number;
    scenarios: StressScenarioResult[];
}
export declare const STRESS_FRAMEWORK_VERSION = "1.0.0";
export declare class StressFrameworkToken {
}
//# sourceMappingURL=stress-models.d.ts.map