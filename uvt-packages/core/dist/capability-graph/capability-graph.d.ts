import { RepositoryScanResult, ProjectType, ServerModel } from '../repository-intelligence/models/models.js';
export interface FrameworkCapability {
    name: string;
    confidence: number;
    pluginName: string;
    version?: string;
}
export interface RoutingCapability {
    model: 'filesystem' | 'router-library' | 'static-html' | 'custom' | 'none';
    library: string;
}
export interface BuildCapability {
    tool: string;
    configFile: string;
    outputDir: string;
}
export interface WorkspaceCapability {
    type: string;
    lockfile: string;
    lockfileGlob: string;
    isMonorepo: boolean;
}
export interface PackageManagerCapability {
    name: 'npm' | 'pnpm' | 'yarn' | 'bun';
    installCmd: string;
    addDevCmd: string;
    runCmd: string;
}
export interface DevServerCapability {
    serverModel: ServerModel;
    startCommand: string;
    healthCheckUrl: string;
    port: number;
}
export interface ProviderCapability {
    name: string;
    configured: boolean;
    cliPackage: string;
    sdkPackage: string;
}
export interface CICapability {
    platform: 'github' | 'gitlab' | 'circleci' | 'none';
    workflowExists: boolean;
    workflowPath: string;
}
export interface ProjectTypeCapability {
    type: ProjectType;
}
export interface CapabilityGraph {
    framework: FrameworkCapability;
    routing: RoutingCapability;
    build: BuildCapability;
    workspace: WorkspaceCapability;
    packageManager: PackageManagerCapability;
    devServer: DevServerCapability;
    provider: ProviderCapability;
    ci: CICapability;
    projectType: ProjectTypeCapability;
}
export declare class CapabilityGraphBuilder {
    /**
     * Build a fully typed CapabilityGraph from a raw RIE scan result.
     */
    static build(scan: RepositoryScanResult, cwd: string): CapabilityGraph;
    private static buildFramework;
    private static buildRouting;
    private static buildBuild;
    private static buildWorkspace;
    private static buildPackageManager;
    private static buildDevServer;
    private static buildProvider;
    private static buildCI;
}
//# sourceMappingURL=capability-graph.d.ts.map