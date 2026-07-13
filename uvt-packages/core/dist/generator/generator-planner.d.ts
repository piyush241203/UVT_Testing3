/**
 * Universal Generator Planner (UGP) — RC-04 URAE
 *
 * Reads a CapabilityGraph and emits a normalized ExecutionPlan.
 * No framework-specific if/else — all decisions flow from graph capabilities.
 */
import { CapabilityGraph } from '../capability-graph/capability-graph.js';
export interface GeneratedArtifact {
    relativePath: string;
    content: string;
    validate: boolean;
}
export interface ScriptEntry {
    name: string;
    command: string;
}
export interface ExecutionPlan {
    packageInstalls: string[];
    configFiles: GeneratedArtifact[];
    scripts: ScriptEntry[];
    ciWorkflow: GeneratedArtifact;
    ignoreEntries: string[];
    envTemplate: string;
}
export declare class GeneratorPlanner {
    /**
     * Build a complete ExecutionPlan from a CapabilityGraph.
     * This replaces every hardcoded generator in the CLI init command.
     */
    static plan(graph: CapabilityGraph): ExecutionPlan;
    private static planPackageInstalls;
    private static planConfigFiles;
    private static planScripts;
    private static planCIWorkflow;
    private static planIgnoreEntries;
    private static planEnvTemplate;
    static generateUVTConfig(graph: CapabilityGraph): string;
    static generatePlaywrightConfig(graph: CapabilityGraph): string;
    static generatePercyConfig(graph: CapabilityGraph): string;
    static generateGHAWorkflow(graph: CapabilityGraph): string;
}
//# sourceMappingURL=generator-planner.d.ts.map