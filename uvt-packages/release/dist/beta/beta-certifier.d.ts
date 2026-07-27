import { BetaReadinessReport } from './beta-models.js';
export declare class BetaCertifierEngine {
    private cwd;
    constructor(cwd?: string);
    runFullBetaCertification(projectName?: string): Promise<BetaReadinessReport>;
}
//# sourceMappingURL=beta-certifier.d.ts.map