import { FrameworkPlugin, RouteDescriptor, RepoContext, DetectionResult } from '@uvt/shared';
/**
 * PHP Framework Plugin for UVT
 * Supports both Plain PHP and Laravel projects.
 * Detects via composer.json + artisan file (Laravel) or plain .php files.
 */
export declare class PhpFrameworkPlugin implements FrameworkPlugin {
    name: string;
    readonly apiVersion: 1;
    detect(repo: RepoContext): Promise<DetectionResult | null>;
    discoverRoutes(repo: RepoContext): Promise<RouteDescriptor[]>;
    /**
     * Laravel: parse routes/web.php for Route::get() definitions
     */
    private discoverLaravelRoutes;
    /**
     * Plain PHP: scan all .php files and map them to routes
     */
    private discoverPlainPhpRoutes;
    private pathToName;
}
//# sourceMappingURL=index.d.ts.map