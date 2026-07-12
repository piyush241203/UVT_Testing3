import { DynamicContext } from '../context/execution-context.js';
import { DynamicSignal } from '../models/signal/signal.js';
import { ExecutionMode } from '../types/index.js';
export interface PipelineStage {
    id: string;
    name: string;
    version: string;
    priority: number;
    dependsOn: string[];
    execute(context: DynamicContext): Promise<void>;
}
export declare class PipelineEngine {
    private context;
    private stages;
    private executionTimeline;
    private outputs;
    private consumedOutputs;
    constructor(context: DynamicContext);
    private registerDefaultStages;
    registerStage(stage: PipelineStage): void;
    getStages(): PipelineStage[];
    verifyPipelineStructure(): string[];
    private verifyContext;
    runVerificationPipeline(): Promise<void>;
    private publishOutput;
    private consumeOutput;
    executeAnalyzers(mode: ExecutionMode): Promise<DynamicSignal[]>;
    executeStabilizers(signals: DynamicSignal[]): Promise<void>;
}
//# sourceMappingURL=pipeline.d.ts.map