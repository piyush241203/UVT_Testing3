import { ASTMetadata } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
import { FrameworkMetadata } from '../../dynamic-engine/metadata/framework.js';
export interface AIEScanResult {
    signals: DynamicSignal[];
    metadata: ASTMetadata;
}
export declare class ASTIntelligenceEngine {
    private cache;
    private parser;
    private visitors;
    private cwd;
    constructor(cwd: string, frameworkMeta?: FrameworkMetadata);
    scan(): Promise<AIEScanResult>;
}
//# sourceMappingURL=engine.d.ts.map