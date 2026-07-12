export interface KnowledgeConfig {
    enabled: boolean;
    useGlobalPatterns: boolean;
    learnFromSuccessfulRuns: boolean;
    minimumPatternConfidence: number;
    shareAcrossRepositories: boolean;
}
export declare const DEFAULT_KNOWLEDGE_CONFIG: KnowledgeConfig;
export type PatternCategory = 'Framework' | 'Component' | 'Region' | 'Rendering' | 'Stabilization' | 'Repository';
export interface KnowledgePattern {
    id: string;
    category: PatternCategory;
    framework: string;
    version: string;
    confidence: number;
    fingerprint: string;
    applicability: string[];
    recommendation: any;
    source: string;
    validationStatus: 'Verified' | 'Pending' | 'Rejected';
}
export interface RepositoryFingerprint {
    id: string;
    frameworks: string[];
    dependencies: string[];
    routing: string[];
}
//# sourceMappingURL=models.d.ts.map