export type FaultScenarioId = 'broken_package_json' | 'broken_yaml_config' | 'missing_config' | 'missing_lockfile' | 'broken_tsconfig' | 'wrong_port' | 'broken_scripts' | 'missing_dependencies' | 'corrupted_workflow';
export type RepairStatus = 'AUTO_REPAIRED' | 'HEALED_WITH_FALLBACK' | 'FAILED';
export interface FaultRepairResult {
    id: FaultScenarioId;
    name: string;
    description: string;
    status: RepairStatus;
    detectionTimeMs: number;
    repairTimeMs: number;
    repairSuccessRatePercent: number;
    manualInterventionRequired: boolean;
    repairDetails: string;
}
export interface FailureRecoveryReport {
    title: string;
    projectName: string;
    timestamp: string;
    overallStatus: RepairStatus;
    selfHealingScore: number;
    totalFaultsInjected: number;
    autoRepairedCount: number;
    manualInterventionCount: number;
    scenarios: FaultRepairResult[];
}
export declare const FAULT_FRAMEWORK_VERSION = "1.0.0";
export declare class FaultFrameworkToken {
}
//# sourceMappingURL=fault-models.d.ts.map