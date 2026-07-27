import { FailureRecoveryReport } from './fault-models.js';
export declare class SelfHealingEngine {
    private cwd;
    constructor(cwd?: string);
    runAllFaultScenarios(projectName?: string): Promise<FailureRecoveryReport>;
    private repairFault;
}
//# sourceMappingURL=self-healing-engine.d.ts.map