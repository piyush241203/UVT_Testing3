/**
 * Base interface for intelligence evidence.
 */
export interface Evidence {
    readonly type: string;
    readonly description: string;
}
export interface ASTNodeEvidence extends Evidence {
    readonly type: 'AST_NODE';
    readonly filePath: string;
    readonly nodeType: string;
    readonly line?: number;
    readonly column?: number;
    readonly snippet?: string;
}
export interface NetworkRequestEvidence extends Evidence {
    readonly type: 'NETWORK_REQUEST';
    readonly url: string;
    readonly method: string;
    readonly payloadSnippet?: string;
    readonly responseType?: string;
}
export interface DOMMutationEvidence extends Evidence {
    readonly type: 'DOM_MUTATION';
    readonly selector: string;
    readonly attributeName?: string;
    readonly oldValue?: string;
    readonly newValue?: string;
}
export interface RepositoryScanEvidence extends Evidence {
    readonly type: 'REPOSITORY_SCAN';
    readonly matchedFilePattern: string;
    readonly packageVersion?: string;
}
export interface FrameworkDetectionEvidence extends Evidence {
    readonly type: 'FRAMEWORK_DETECTION';
    readonly frameworkName: string;
    readonly indicator: string;
}
export interface PackageDetectionEvidence extends Evidence {
    readonly type: 'PACKAGE_DETECTION';
    readonly packageName: string;
    readonly version: string;
    readonly isDevDependency: boolean;
}
export interface AIDecisionEvidence extends Evidence {
    readonly type: 'AI_DECISION';
    readonly modelUsed: string;
    readonly rawPrompt?: string;
    readonly inferenceTimeMs: number;
}
//# sourceMappingURL=evidence.d.ts.map