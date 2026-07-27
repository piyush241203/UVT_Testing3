import { ArtifactKind, ArtifactValidationResult, ArtifactValidationReport } from './types.js';
export type RegeneratorCallback = (filePath: string, kind: ArtifactKind) => void;
export declare class ArtifactValidationEngine2 {
    private parser;
    private compiler;
    private executor;
    private dryRunner;
    constructor();
    validateArtifact(filePath: string, kind: ArtifactKind, regenerator?: RegeneratorCallback): Promise<ArtifactValidationResult>;
    compileSuiteReport(results: ArtifactValidationResult[]): ArtifactValidationReport;
}
//# sourceMappingURL=engine.d.ts.map