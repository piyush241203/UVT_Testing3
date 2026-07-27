import { PerformanceCertificationReport } from './types.js';
export declare class PerformanceCertificationRunner {
    private cwd;
    private historyStore;
    constructor(cwd?: string);
    runAll(projectName?: string): Promise<PerformanceCertificationReport>;
}
//# sourceMappingURL=runner.d.ts.map