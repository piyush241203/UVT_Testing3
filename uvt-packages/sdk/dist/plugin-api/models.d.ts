export interface PluginManifest {
    name: string;
    version: string;
    author: string;
    description: string;
    uvtVersion: string;
    capabilities: string[];
}
export interface PluginContext {
    cwd: string;
    config: any;
    logger: any;
}
export interface LifecycleHooks {
    initialize?(context: PluginContext): Promise<void>;
    activate?(): Promise<void>;
    beforeRepositoryScan?(): Promise<void>;
    afterRepositoryScan?(repoData: any): Promise<void>;
    beforeDecision?(node: any): Promise<void>;
    afterDecision?(decision: any): Promise<void>;
    beforeStabilization?(): Promise<void>;
    afterStabilization?(): Promise<void>;
    beforeSnapshot?(): Promise<void>;
    afterSnapshot?(): Promise<void>;
    beforeReport?(): Promise<void>;
    afterReport?(): Promise<void>;
    beforeSync?(): Promise<void>;
    dispose?(): Promise<void>;
}
export interface UvtPlugin extends LifecycleHooks {
    manifest: PluginManifest;
}
//# sourceMappingURL=models.d.ts.map