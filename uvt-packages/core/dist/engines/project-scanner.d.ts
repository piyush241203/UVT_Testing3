import { RepoContext } from '@uvt/shared';
export interface ProjectScanDetails {
    framework: string;
    frameworkConfidence: number;
    frameworkEvidence: string[];
    stylingEngine: string;
    pagesCount: number;
    componentsCount: number;
    apisCount: number;
    dynamicWidgetsCount: number;
    percyConfigured: boolean;
    playwrightConfigured: boolean;
}
export declare function scanProject(context: RepoContext, frameworkDetails: {
    name: string;
    confidence: number;
    evidence: string[];
}): Promise<ProjectScanDetails>;
//# sourceMappingURL=project-scanner.d.ts.map