export type SubsystemName = 'repository-scan' | 'capability-graph' | 'generator' | 'validation' | 'tcse' | 'dse' | 'playwright' | 'provider' | 'snapshot' | 'report';
export interface PerformanceMetrics {
    executionTimeMs: number;
    memoryHeapUsedMb: number;
    memoryRssMb: number;
    cpuUserPercent: number;
    cpuSystemPercent: number;
    networkRequestsCount: number;
    domNodesCount: number;
    routesCount: number;
    componentsCount: number;
    importsCount: number;
}
export type BenchmarkStatus = 'passed' | 'warning' | 'degraded' | 'failed';
export interface SubsystemBenchmarkResult {
    subsystem: SubsystemName;
    metrics: PerformanceMetrics;
    status: BenchmarkStatus;
    baselineTimeMs?: number;
    diffPercent?: number;
    thresholdMs?: number;
    timestamp: string;
    notes?: string[];
}
export interface HistoricalRunRecord {
    runId: string;
    timestamp: string;
    projectName: string;
    subsystems: SubsystemBenchmarkResult[];
    overallScore: number;
}
export interface HistoricalBenchmarkData {
    schemaVersion: string;
    lastUpdated: string;
    history: HistoricalRunRecord[];
    baselines: Record<SubsystemName, number>;
}
export interface PerformanceCertificationReport {
    projectName: string;
    timestamp: string;
    overallStatus: BenchmarkStatus;
    overallScore: number;
    totalDurationMs: number;
    subsystems: SubsystemBenchmarkResult[];
    historyComparison?: {
        previousRunTimestamp?: string;
        degradedSubsystems: string[];
        improvedSubsystems: string[];
    };
}
export declare const BENCHMARK_SCHEMA_VERSION = "1.0.0";
export declare class BenchmarkToken {
}
//# sourceMappingURL=types.d.ts.map