"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeEngine = void 0;
const models_js_1 = require("../models/models.js");
const local_storage_js_1 = require("../storage/local-storage.js");
const fingerprint_generator_js_1 = require("../repository/fingerprint-generator.js");
const pattern_matcher_js_1 = require("../matching/pattern-matcher.js");
class KnowledgeEngine {
    config;
    storage = new local_storage_js_1.LocalKnowledgeStorage();
    generator = new fingerprint_generator_js_1.FingerprintGenerator();
    matcher = new pattern_matcher_js_1.PatternMatcher();
    constructor(config) {
        this.config = { ...models_js_1.DEFAULT_KNOWLEDGE_CONFIG, ...config };
    }
    async loadKnowledge(context) {
        if (!this.config.enabled)
            return [];
        const fingerprint = this.generator.generate(context);
        context.runtimeMetadata.set('repositoryFingerprint', fingerprint);
        const allPatterns = await this.storage.loadPatterns();
        const matchedPatterns = this.matcher.match(fingerprint, allPatterns);
        // Filter by confidence
        const confidentPatterns = matchedPatterns.filter(p => p.confidence >= this.config.minimumPatternConfidence);
        context.runtimeMetadata.set('knowledgePatterns', confidentPatterns);
        context.logger.info(`KPE: Loaded ${confidentPatterns.length} confident patterns for fingerprint ${fingerprint.id}.`);
        return confidentPatterns;
    }
    async recordFeedback(context, reportOrSuccess) {
        if (!this.config.learnFromSuccessfulRuns)
            return;
        context.logger.info(`KPE: Feedback recorded. Structure received.`);
    }
}
exports.KnowledgeEngine = KnowledgeEngine;
//# sourceMappingURL=engine.js.map