import { DynamicContext } from '../context/execution-context.js';
import { ExecutionMode } from '../types/index.js';
export declare class DynamicOrchestrator {
    private context;
    private pipeline;
    constructor(context: DynamicContext);
    /**
     * Main entry point to stabilize the page and capture snapshot.
     */
    execute(url: string, providerName?: string, snapshotOptions?: Record<string, unknown>, executionMode?: ExecutionMode): Promise<void>;
    private runSnapshotSafe;
    private setupEventListeners;
}
//# sourceMappingURL=orchestrator.d.ts.map