import { RepoContext, FrameworkPlugin } from '@uvt/shared';
import { CapabilityGraph, CapabilityGraphBuilder } from '../capability-graph/capability-graph.js';
export declare function createRepoContext(cwd: string): Promise<RepoContext>;
/**
 * Build a fully typed CapabilityGraph from an RIE scan.
 * This is the primary entry point for the URAE Generator Planner and
 * Artifact Validation Engine.
 */
export declare function buildCapabilityGraph(cwd: string): Promise<CapabilityGraph>;
export { CapabilityGraph, CapabilityGraphBuilder };
export declare function resolveFramework(repo: RepoContext, plugins: FrameworkPlugin[]): FrameworkPlugin;
export declare function resolveFrameworkAsync(repo: RepoContext, plugins: FrameworkPlugin[]): Promise<{
    plugin: FrameworkPlugin;
    confidence: number;
    evidence: string[];
}>;
//# sourceMappingURL=repository-analyzer.d.ts.map