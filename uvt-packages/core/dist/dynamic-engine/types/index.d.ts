export declare enum PipelinePhase {
    BEFORE = "BEFORE",
    RUN = "RUN",
    AFTER = "AFTER",
    CLEANUP = "CLEANUP"
}
export declare enum ExecutionMode {
    SEQUENTIAL = "SEQUENTIAL",
    PARALLEL = "PARALLEL"
}
export interface StabilizationResult {
    readonly success: boolean;
    readonly modifiedSelectors: string[];
    readonly error?: Error;
    readonly executionTimeMs: number;
}
//# sourceMappingURL=index.d.ts.map