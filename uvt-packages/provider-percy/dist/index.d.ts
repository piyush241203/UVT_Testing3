import { VisualProvider } from '@uvt/shared';
export declare class PercyProvider implements VisualProvider {
    name: string;
    readonly apiVersion: 1;
    private percyRunning;
    private startedPercyProcess;
    initialize(options: {
        cwd: string;
        config: any;
        isSelective?: boolean;
    }): Promise<void>;
    /**
     * Removes stale Percy agent lock files and kills orphan processes on port 5338.
     * This prevents "port already in use" errors between consecutive uvt run invocations.
     */
    private clearStalePercyLock;
    snapshot(page: any, opts: {
        name: string;
        url: string;
        route?: any;
    }): Promise<void>;
    finalize(): Promise<void>;
    private checkPercyAgent;
}
//# sourceMappingURL=index.d.ts.map