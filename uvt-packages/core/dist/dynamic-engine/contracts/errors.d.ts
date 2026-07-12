export declare class AnalyzerError extends Error {
    readonly analyzerId: string;
    constructor(analyzerId: string, message: string);
}
export declare class PipelineError extends Error {
    readonly phase: string;
    constructor(message: string, phase: string);
}
export declare class PluginError extends Error {
    readonly pluginId: string;
    constructor(pluginId: string, message: string);
}
export declare class ProviderError extends Error {
    readonly providerId: string;
    constructor(providerId: string, message: string);
}
export declare class ValidationError extends Error {
    readonly field: string;
    constructor(field: string, message: string);
}
//# sourceMappingURL=errors.d.ts.map