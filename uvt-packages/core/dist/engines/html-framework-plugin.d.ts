import { FrameworkPlugin, RouteDescriptor, RepoContext, DetectionResult } from '@uvt/shared';
export declare class HtmlFrameworkPlugin implements FrameworkPlugin {
    name: string;
    readonly apiVersion: 1;
    detect(repo: RepoContext): Promise<DetectionResult | null>;
    discoverRoutes(repo: RepoContext): Promise<RouteDescriptor[]>;
    private pathToName;
}
//# sourceMappingURL=html-framework-plugin.d.ts.map