export interface DSEConfigurationSchema {
    dynamic: {
        enabled: boolean;
        profile: 'strict' | 'relaxed' | 'custom';
        thresholds: {
            minConfidence: number;
            minSeverity: string;
        };
        plugins: {
            enabled: string[];
            disabled: string[];
        };
        analyzers: Record<string, unknown>;
        stabilizers: Record<string, unknown>;
        provider: Record<string, unknown>;
        logging: {
            level: 'debug' | 'info' | 'warn' | 'error';
            file?: string;
        };
        performance: {
            timeoutMs: number;
            parallelExecution: boolean;
        };
        diagnostics: {
            enabled: boolean;
            reportPath?: string;
        };
    };
}
//# sourceMappingURL=configuration.d.ts.map