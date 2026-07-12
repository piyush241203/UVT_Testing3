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
    };
    graph: CapabilityGraphNode[];
    signals: any[];
}
//# sourceMappingURL=models.d.ts.map