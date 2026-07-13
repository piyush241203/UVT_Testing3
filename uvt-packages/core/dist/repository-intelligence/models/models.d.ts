export interface CapabilityGraphNode {
    id: string;
    type: string;
    name: string;
    confidence: number;
    evidence: string[];
    dependencies: string[];
}
export interface RIEContext {
    cwd: string;
    packageJson: any;
    dependencies: Record<string, string>;
    files: string[];
    capabilities: Map<string, CapabilityGraphNode>;
    logger: any;
}
export interface RIEDetector {
    readonly name: string;
    detect(context: RIEContext): Promise<void>;
}
export type ProjectType = 'SPA' | 'SSR' | 'SSG' | 'MPA' | 'Hybrid' | 'Static';
export type ServerModel = 'dev-server' | 'static' | 'SSR' | 'Node';
export interface RepositoryScanResult {
    metadata: {
        framework: string;
        buildTool: string;
        packageManager: string;
        workspace: string;
        routing: string;
        styling: string;
        auth: string;
        realtime: string;
        charts: string;
        maps: string;
        analytics: string;
        payments: string;
        testing: string;
        cms: string;
        animation: string;
        projectType: ProjectType;
        serverModel: ServerModel;
        devServerCommand: string;
        outputDir: string;
        lockfileGlob: string;
    };
    graph: CapabilityGraphNode[];
    signals: any[];
}
//# sourceMappingURL=models.d.ts.map