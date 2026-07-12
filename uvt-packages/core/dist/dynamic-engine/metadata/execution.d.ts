export interface ExecutionMetadata {
    readonly pipelineStartTime: number;
    readonly pipelineEndTime?: number;
    readonly durationMs?: number;
    readonly analyzerCount: number;
    readonly signalCount: number;
    readonly stabilizerCount: number;
    readonly snapshotProviderName?: string;
    readonly pipelineState: 'INITIALIZING' | 'GATHERING' | 'STABILIZING' | 'SNAPSHOT' | 'COMPLETED' | 'FAILED';
    readonly errors: ReadonlyArray<Error>;
    readonly warnings: ReadonlyArray<string>;
}
//# sourceMappingURL=execution.d.ts.map