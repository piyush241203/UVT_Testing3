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
    snapshot(page: any, opts: {
        name: string;
        url: string;
        route?: any;
    }): Promise<void>;
    finalize(): Promise<void>;
    private startPercyAgent;
    private checkPercyAgent;
}
//# sourceMappingURL=index.d.ts.map