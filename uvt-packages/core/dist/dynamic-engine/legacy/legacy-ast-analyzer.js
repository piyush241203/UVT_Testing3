"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyASTAnalyzer = void 0;
const index_js_1 = require("../index.js");
class LegacyASTAnalyzer {
    name = 'LegacyASTAnalyzer';
    context;
    initialize(context) {
        this.context = context;
        this.context.logger.debug(`[${this.name}] Initialized legacy AST adapter.`);
    }
    async analyze() {
        const signals = [];
        // Delegate to new Advanced AST Intelligence Engine
        if (this.context?.repositoryMetadata?.repositoryRoot) {
            try {
                const { ASTIntelligenceEngine } = await import('../../ast-intelligence/index.js');
                const engine = new ASTIntelligenceEngine(this.context.repositoryMetadata.repositoryRoot, this.context.frameworkMetadata);
                const aieResult = await engine.scan();
                signals.push(...aieResult.signals);
            }
            catch (e) {
                this.context.logger.warn(`LegacyASTAnalyzer failed to run AIE: ${e}`);
            }
        }
        if (!this.context?.page)
            return signals;
        const page = this.context.page;
        const hasStripe = await page.evaluate(() => !!window.Stripe || !!document.querySelector('iframe[src*="stripe.com"]'));
        const hasGoogleMaps = await page.evaluate(() => !!window.google?.maps);
        if (hasStripe) {
            signals.push(this.createSignal('stripe', 95, index_js_1.SignalCategory.CUSTOM));
        }
        if (hasGoogleMaps) {
            signals.push(this.createSignal('google-maps', 95, index_js_1.SignalCategory.MAP));
        }
        return signals;
    }
    createSignal(subtype, confidence, category) {
        return {
            id: `legacy-ast-${subtype}-${Date.now()}`,
            analyzerId: this.name,
            analyzerType: 'ast',
            framework: this.context?.frameworkMetadata?.frameworkName || 'unknown',
            category,
            subtype,
            confidence,
            severity: index_js_1.SignalSeverity.HIGH,
            executionPhase: index_js_1.ExecutionPhase.RENDER,
            timestamp: Date.now(),
            reasoning: `Legacy AST heuristic matched SDK footprint for ${subtype}.`,
            evidence: [],
            tags: ['legacy', 'ast', subtype],
            metadata: {}
        };
    }
    dispose() { }
}
exports.LegacyASTAnalyzer = LegacyASTAnalyzer;
//# sourceMappingURL=legacy-ast-analyzer.js.map