export type FrameworkType = 'React' | 'Next' | 'Vue' | 'Angular' | 'Svelte' | 'Astro' | 'Nuxt' | 'Remix' | 'Laravel' | 'PHP';
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';
export type OperatingSystem = 'Windows' | 'Linux' | 'macOS';
export type VisualProviderType = 'Percy' | 'Playwright';
export type BrowserType = 'Chromium' | 'Firefox' | 'WebKit';
export type BuildToolType = 'Vite' | 'Webpack' | 'esbuild' | 'Turbopack' | 'Rollup';
export type CompatibilityStatus = 'Certified' | 'Compatible' | 'Experimental' | 'Unsupported';
export interface CombinationVerificationCheck {
    feature: string;
    passed: boolean;
    score: number;
    details: string;
}
export interface MatrixCombination {
    id: string;
    framework: FrameworkType;
    frameworkVersion: string;
    nodeVersion: string;
    packageManager: PackageManager;
    operatingSystem: OperatingSystem;
    provider: VisualProviderType;
    browser: BrowserType;
    buildTool: BuildToolType;
    status: CompatibilityStatus;
    compatibilityScore: number;
    checks: CombinationVerificationCheck[];
    lastVerified: string;
}
export interface FrameworkCompatibilitySummary {
    framework: FrameworkType;
    totalCombinations: number;
    certifiedCount: number;
    compatibleCount: number;
    experimentalCount: number;
    unsupportedCount: number;
    averageScore: number;
    passRatePercent: number;
}
export interface CompatibilityMatrixReport {
    title: string;
    generatedAt: string;
    environment: {
        nodeVersion: string;
        os: string;
        defaultProvider: string;
    };
    totalCombinations: number;
    overallScore: number;
    passRatePercent: number;
    frameworkSummaries: FrameworkCompatibilitySummary[];
    combinations: MatrixCombination[];
}
export declare const COMPATIBILITY_MATRIX_VERSION = "1.0.0";
export declare class MatrixToken {
}
//# sourceMappingURL=matrix-models.d.ts.map