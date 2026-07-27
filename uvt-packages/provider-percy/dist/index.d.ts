import { VisualProvider } from '@uvt/shared';
export declare class PercyProvider implements VisualProvider {
    name: string;
    readonly apiVersion: 1;
    private percyRunning;
    private autoStarted;
    prepare(options: {
        cwd: string;
        config: any;
    }): Promise<void>;
    initialize(options: {
        cwd: string;
        config: any;
        isSelective?: boolean;
    }): Promise<void>;
    /**
     * Relaunch the current UVT process inside `percy exec -- <same command>`.
     *
     * This is the correct Percy integration pattern:
     *   npx percy exec -- node bin.js test --port 3000
     *
     * Percy exec starts the Percy agent, sets PERCY_SERVER_ADDRESS, then runs the
     * child command. The child process inherits PERCY_SERVER_ADDRESS and will hit
     * Case 1 on re-entry to initialize(), connecting to the running agent.
     *
     * NOTE: On Windows, node.exe may live in a path with spaces (e.g. C:\Program Files\nodejs).
     * We must quote the node executable path to prevent the shell from splitting it.
     */
    private _relaunchInsidePercyExec;
    snapshot(page: any, opts: {
        name: string;
        url: string;
        route?: any;
    }): Promise<void>;
    finalize(): Promise<void>;
    private stopPercyAgent;
    private checkPercyAgent;
    private pingHealthcheck;
}
//# sourceMappingURL=index.d.ts.map