import { FrameworkPlugin, VisualProvider } from '@uvt/shared';
import { ReportData } from '@uvt/reporter';
export * from './engines/project-scanner.js';
export * from './engines/repository-analyzer.js';
export * from './onboarding/index.js';
export * from './build-management/index.js';
export * from './cloud-sync/index.js';
export * from './dynamic-engine/index.js';
export declare class PluginRegistry {
    private frameworks;
    private providers;
    registerFramework(plugin: FrameworkPlugin): void;
    registerProvider(plugin: VisualProvider): void;
    getFramework(name: string): FrameworkPlugin | undefined;
    getProvider(name: string): VisualProvider | undefined;
    getFrameworks(): FrameworkPlugin[];
}
export declare const pluginRegistry: PluginRegistry;
export declare class CoreEngine {
    private cwd;
    private config;
    constructor(cwd: string);
    initialize(): Promise<void>;
    getFrameworkDetails(): Promise<{
        name: string;
        confidence: number;
        evidence: string[];
    }>;
    generate(): Promise<string>;
    run(options?: {
        host?: string;
        port?: number;
        changed?: boolean;
    }): Promise<ReportData>;
    private generateSpecFiles;
}
//# sourceMappingURL=index.d.ts.map