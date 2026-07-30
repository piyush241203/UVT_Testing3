/**
 * URAE Chaos & Self-Healing Failure Injection Test Suite
 *
 * Purposely simulates runtime failures and verifies that the Universal
 * Recovery & Adaptation Engine (URAE) auto-recovers or safely degrades.
 */
export interface ChaosFailureCase {
    id: string;
    category: string;
    description: string;
    trigger: () => Promise<void>;
    verifyRecovery: () => Promise<boolean>;
}
export declare class URAEChaosRunner {
    private cases;
    constructor();
    private _registerCases;
    runSuite(): Promise<{
        passed: number;
        failed: number;
        total: number;
        logs: string[];
    }>;
}
//# sourceMappingURL=urae-chaos.test.d.ts.map