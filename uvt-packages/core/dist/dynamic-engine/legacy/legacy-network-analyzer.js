"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyNetworkAnalyzer = void 0;
const index_js_1 = require("../index.js");
class LegacyNetworkAnalyzer {
    name = 'LegacyNetworkAnalyzer';
    networkAnalyzer;
    context;
    snieEngine;
    constructor(networkAnalyzer) {
        this.networkAnalyzer = networkAnalyzer;
    }
    initialize(context) {
        this.context = context;
        this.context.logger.debug(`[${this.name}] Initialized legacy network adapter.`);
        if (this.context.page) {
            import('../../network-intelligence/index.js').then(({ SemanticNetworkIntelligenceEngine }) => {
                this.snieEngine = new SemanticNetworkIntelligenceEngine();
                this.snieEngine.attach(this.context.page);
            }).catch(e => {
                this.context?.logger.warn(`Failed to initialize SNIE: ${e}`);
            });
        }
    }
    async analyze() {
        const signals = [];
        // Harvest SNIE semantic signals
        if (this.snieEngine) {
            signals.push(...this.snieEngine.signals);
        }
        const intercepted = this.networkAnalyzer.getInterceptedResponses();
        if (intercepted.some((res) => res.dynamicFields && res.dynamicFields.length > 0)) {
            signals.push({
                id: `legacy-network-${Date.now()}`,
                analyzerId: this.name,
                analyzerType: 'network',
                framework: this.context?.frameworkMetadata?.frameworkName || 'unknown',
                category: index_js_1.SignalCategory.NETWORK,
                confidence: 90,
                severity: index_js_1.SignalSeverity.HIGH,
                executionPhase: index_js_1.ExecutionPhase.BEFORE_RENDER,
                timestamp: Date.now(),
                reasoning: 'Legacy network analyzer detected dynamic fields in responses.',
                evidence: [],
                tags: ['legacy', 'network'],
                metadata: { interceptedCount: intercepted.length }
            });
        }
        return signals;
    }
    dispose() {
        if (this.snieEngine) {
            this.snieEngine.detach();
        }
    }
}
exports.LegacyNetworkAnalyzer = LegacyNetworkAnalyzer;
//# sourceMappingURL=legacy-network-analyzer.js.map