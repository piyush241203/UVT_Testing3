import pino from 'pino';
export declare const pinoLogger: pino.Logger<never, boolean>;
export declare const logger: {
    info: (message: string, context?: any) => void;
    success: (message: string, context?: any) => void;
    warn: (message: string, context?: any) => void;
    error: (message: string | Error, context?: any) => void;
    debug: (message: string, context?: any) => void;
    step: (step: string, message: string) => void;
};
export interface RepoContext {
    readonly cwd: string;
    readonly packageJson: any;
    readonly dependencies: Record<string, string>;
    readonly files: string[];
}
export interface DetectionResult {
    readonly confidence: number;
    readonly evidence: string[];
}
export interface RouteDescriptor {
    name: string;
    url: string;
    sourceFile?: string;
    layout?: string;
    dynamicParams?: string[];
    guards?: string[];
    metadata?: Record<string, any>;
}
export interface ComponentDescriptor {
    name: string;
    file: string;
    props?: string[];
    jsxChildrenTypes?: string[];
}
export interface FrameworkPlugin {
    readonly name: string;
    readonly apiVersion: 1;
    detect(repo: RepoContext): Promise<DetectionResult | null>;
    discoverRoutes(repo: RepoContext): Promise<RouteDescriptor[]>;
    discoverComponents?(repo: RepoContext): Promise<ComponentDescriptor[]>;
}
export interface VisualProvider {
    readonly name: string;
    readonly apiVersion: 1;
    initialize(options: {
        cwd: string;
        config: any;
        isSelective?: boolean;
    }): Promise<void>;
    snapshot(page: any, opts: {
        name: string;
        url: string;
        route?: RouteDescriptor;
    }): Promise<any>;
    upload?(handles: any[]): Promise<any>;
    compare?(baseline: string, current: string): Promise<any>;
    finalize(): Promise<void>;
}
export interface UVTConfig {
    provider: string;
    framework: 'auto' | 'react' | 'next' | 'vue' | 'angular' | 'svelte' | string;
    cache?: boolean;
    workers?: 'auto' | number;
    report?: {
        html?: boolean;
        json?: boolean;
    };
    dynamicDetection?: boolean;
}
export interface RepositoryModel {
    framework: string;
    routes: RouteDescriptor[];
    dependencies: Record<string, string>;
    metadata: Record<string, any>;
}
//# sourceMappingURL=index.d.ts.map