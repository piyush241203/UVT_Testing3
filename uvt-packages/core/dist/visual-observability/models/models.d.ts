export interface ObservabilityConfig {
    enabled: boolean;
    tracing: boolean;
    profiling: boolean;
    exportJson: boolean;
    exportChromeTrace: boolean;
    retainRuns: number;
}
export declare const DEFAULT_OBSERVABILITY_CONFIG: ObservabilityConfig;
export interface Span {
    id: string;
    parentId?: string;
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    metadata: Record<string, any>;
    events: TraceEvent[];
}
export interface TraceEvent {
    name: string;
    timestamp: number;
    metadata?: Record<string, any>;
}
export interface ExecutionTrace {
    traceId: string;
    runId: string;
    repositoryFingerprint?: string;
    startTime: number;
    endTime: number;
    duration: number;
    spans: Span[];
}
export interface TraceExporter {
    export(trace: ExecutionTrace): Promise<void>;
}
//# sourceMappingURL=models.d.ts.map