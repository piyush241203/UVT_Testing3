export interface CertificationTarget {
    name: string;
    path: string;
    expectedFramework: string;
    expectedProjectType: string;
    expectedRouteCount: number;
}
export interface CertificationCheck {
    name: string;
    passed: boolean;
    details: string;
}
export interface CertificationReport {
    target: string;
    framework: string;
    projectType: string;
    routeCount: number;
    checks: CertificationCheck[];
    passed: boolean;
}
export declare class CertificationRunner {
    /**
     * Run the full certification matrix across all provided targets.
     */
    static run(targets: CertificationTarget[]): Promise<CertificationReport[]>;
    private static certifyOne;
    /**
     * Print a formatted certification matrix table to stdout.
     */
    static printMatrix(reports: CertificationReport[]): void;
}
//# sourceMappingURL=certification-runner.d.ts.map