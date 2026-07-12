import { DynamicContext } from '../../dynamic-engine/index.js';
import { KnowledgeConfig, KnowledgePattern } from '../models/models.js';
export declare class KnowledgeEngine {
    private config;
    private storage;
    private generator;
    private matcher;
    constructor(config?: Partial<KnowledgeConfig>);
    loadKnowledge(context: DynamicContext): Promise<KnowledgePattern[]>;
    recordFeedback(context: DynamicContext, reportOrSuccess: any): Promise<void>;
}
//# sourceMappingURL=engine.d.ts.map