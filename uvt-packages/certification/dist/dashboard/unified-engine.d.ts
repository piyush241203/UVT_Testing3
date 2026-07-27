import { UnifiedRegressionReport } from './unified-models.js';
export declare class UnifiedRegressionEngine {
    private cwd;
    constructor(cwd?: string);
    aggregate(projectName?: string): Promise<UnifiedRegressionReport>;
}
//# sourceMappingURL=unified-engine.d.ts.map