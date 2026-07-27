import { StressCertificationReport } from './stress-models.js';
export declare class StressTestRunner {
    private cwd;
    constructor(cwd?: string);
    runAllScenarios(projectName?: string): Promise<StressCertificationReport>;
}
//# sourceMappingURL=stress-runner.d.ts.map