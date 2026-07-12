import { VisualProvider } from '@uvt/shared';
export declare class PlaywrightProvider implements VisualProvider {
    name: string;
    readonly apiVersion: 1;
    private cwd;
    private latestDir;
    private baselineDir;
    private diffDir;
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
    private compareImages;
    private resizeImage;
}
//# sourceMappingURL=index.d.ts.map