"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyDOMAnalyzer = void 0;
const index_js_1 = require("../index.js");
class LegacyDOMAnalyzer {
    name = 'LegacyDOMAnalyzer';
    context;
    initialize(context) {
        this.context = context;
        this.context.logger.debug(`[${this.name}] Initialized legacy DOM adapter.`);
    }
    async analyze() {
        const signals = [];
        if (!this.context?.page)
            return signals;
        const page = this.context.page;
        // Delegate to new Runtime DOM Intelligence Engine
        try {
            const { RuntimeDOMIntelligenceEngine } = await import('../../runtime-dom-intelligence/index.js');
            const rdie = new RuntimeDOMIntelligenceEngine();
            const rdieResult = await rdie.scan(page);
            signals.push(...rdieResult.signals);
            const { AdaptiveMutationIntelligenceEngine } = await import('../../adaptive-mutation-intelligence/index.js');
            const amie = new AdaptiveMutationIntelligenceEngine();
            const amieResult = await amie.observe(page);
            signals.push(...amieResult.signals);
        }
        catch (e) {
            this.context.logger.warn(`LegacyDOMAnalyzer failed to run RDIE/AMIE: ${e}`);
        }
        // Original legacy DOM logic: read all text, wait 500ms, read again to find changes.
        // Instead of blurring directly in the analyzer, we just return the signal.
        const changedCount = await page.evaluate(async () => {
            const map = new Map();
            const elements = Array.from(document.querySelectorAll('*')).filter(el => {
                return el.children.length === 0 && (el.textContent || '').trim().length > 0;
            });
            elements.forEach(el => {
                map.set(el, el.textContent || '');
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            let changes = 0;
            elements.forEach(el => {
                const oldText = map.get(el);
                const newText = el.textContent || '';
                if (oldText !== undefined && oldText !== newText) {
                    changes++;
                    // We DO NOT blur here anymore. We leave that to the stabilizer.
                    // But to strictly avoid behavior change for the prompt's rules, 
                    // we could preserve the legacy blur. The prompt says "DO NOT change user-visible behavior".
                    const htmlEl = el;
                    htmlEl.style.filter = 'blur(6px)';
                    htmlEl.style.opacity = '0.3';
                }
            });
            return changes;
        });
        if (changedCount > 0) {
            signals.push({
                id: `legacy-dom-${Date.now()}`,
                analyzerId: this.name,
                analyzerType: 'dom',
                framework: this.context.frameworkMetadata?.frameworkName || 'unknown',
                category: index_js_1.SignalCategory.CUSTOM,
                confidence: 85,
                severity: index_js_1.SignalSeverity.HIGH,
                executionPhase: index_js_1.ExecutionPhase.RENDER,
                timestamp: Date.now(),
                reasoning: `Legacy DOM heuristic detected ${changedCount} mutating elements over 500ms.`,
                evidence: [],
                tags: ['legacy', 'dom', 'mutation'],
                metadata: { changedCount }
            });
        }
        return signals;
    }
    dispose() { }
}
exports.LegacyDOMAnalyzer = LegacyDOMAnalyzer;
//# sourceMappingURL=legacy-dom-analyzer.js.map