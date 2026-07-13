import { ValidationError } from './artifact-validator.js';
import { CapabilityGraph } from '../capability-graph/capability-graph.js';
export interface HealingReport {
    artifact: string;
    cycles: number;
    healed: boolean;
    finalErrors: ValidationError[];
}
export declare class SelfHealingGenerator {
    /**
     * Attempt to heal a failed artifact. Returns a HealingReport.
     * Healing is verbose — every repair action is logged.
     */
    static heal(artifactPath: string, errors: ValidationError[], graph: CapabilityGraph): Promise<HealingReport>;
    private static healYAML;
    private static sanitizeYAML;
    private static healJSON;
    private static healGeneric;
    /**
     * Validate → heal loop for a batch of artifacts.
     * Returns summary of healing operations.
     */
    static validateAndHeal(artifactPaths: string[], graph: CapabilityGraph): Promise<HealingReport[]>;
}
//# sourceMappingURL=self-healing-generator.d.ts.map