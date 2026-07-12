export interface PluginDependency {
    readonly pluginId: string;
    readonly versionRange: string;
    readonly required: boolean;
}
export interface PluginManifest {
    readonly id: string;
    readonly name: string;
    readonly version: string;
    readonly author: string;
    readonly description: string;
    readonly capabilities: ReadonlyArray<string>;
    readonly supportedFrameworks: ReadonlyArray<string>;
    readonly dependencies: ReadonlyArray<PluginDependency>;
    readonly priority: number;
    readonly license?: string;
}
//# sourceMappingURL=manifest.d.ts.map