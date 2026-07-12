import { KnowledgePattern } from '../models/models.js';
export declare class LocalKnowledgeStorage {
    private patterns;
    loadPatterns(): Promise<KnowledgePattern[]>;
    savePattern(pattern: KnowledgePattern): Promise<void>;
}
//# sourceMappingURL=local-storage.d.ts.map