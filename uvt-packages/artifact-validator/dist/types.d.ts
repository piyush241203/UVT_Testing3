export type ArtifactKind = 'package.json' | 'uvt-config' | 'github-workflow' | 'playwright-config' | 'percy-config' | 'tsconfig' | 'vite-config' | 'webpack-config' | 'angular-json' | 'next-config' | 'astro-config' | 'nuxt-config';
export interface PhaseResult {
    passed: boolean;
    durationMs: number;
    error?: string;
    details?: string;
}
export interface ArtifactValidationResult {
    artifactId: string;
    artifactPath: string;
    kind: ArtifactKind;
    passed: boolean;
    autoRegenerated: boolean;
    phases: {
        parse: PhaseResult;
        compile: PhaseResult;
        execute: PhaseResult;
        dryRun: PhaseResult;
    };
    errors: string[];
    timestamp: number;
}
export interface ArtifactValidationReport {
    totalValidated: number;
    totalPassed: number;
    totalFailed: number;
    totalAutoRegenerated: number;
    overallPassed: boolean;
    results: ArtifactValidationResult[];
    timestamp: number;
}
//# sourceMappingURL=types.d.ts.map