import { ExecutionPlan } from './generator-planner.js';
import { CapabilityGraph } from '../capability-graph/capability-graph.js';
export interface WriteResult {
    path: string;
    written: boolean;
    skipped: boolean;
    healed: boolean;
    errors: string[];
}
export declare class ArtifactWriter {
    /**
     * Write all artifacts in the ExecutionPlan to the filesystem.
     * Validate and heal each marked artifact automatically.
     */
    static write(cwd: string, plan: ExecutionPlan, graph: CapabilityGraph): Promise<WriteResult[]>;
    private static writeArtifact;
    private static updateGitignore;
}
//# sourceMappingURL=artifact-writer.d.ts.map