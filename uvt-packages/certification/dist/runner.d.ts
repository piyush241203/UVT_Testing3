import { RealRepoMetadata } from './metadata.js';
import { CertificationSuiteSummary } from './reporter.js';
export declare class CertificationRunner {
    private downloader;
    private validator;
    private reporter;
    private dashboard;
    constructor();
    runFullSuite(customRegistry?: RealRepoMetadata[]): Promise<CertificationSuiteSummary>;
}
//# sourceMappingURL=runner.d.ts.map