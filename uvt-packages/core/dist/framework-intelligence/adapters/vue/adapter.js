"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueAdapter = void 0;
const file_scanner_js_1 = require("../../utils/file-scanner.js");
const index_js_1 = require("../../../dynamic-engine/index.js");
class VueAdapter {
    name = 'VueAdapter';
    cwd;
    metadata = { framework: 'Vue' };
    signals = [];
    initialize(cwd) {
        this.cwd = cwd;
    }
    supports(frameworkName) {
        return frameworkName.includes('Vue') || frameworkName.includes('Nuxt');
    }
    async detect() {
        const files = await file_scanner_js_1.FastFileScanner.scan(this.cwd);
        const contents = await file_scanner_js_1.FastFileScanner.readFilesContent(files, 300);
        let hasComposition = false;
        let hasOptions = false;
        let hasSuspense = false;
        let hasTeleport = false;
        let hasPinia = false;
        let hasVuex = false;
        for (const { content } of contents) {
            if (/<script\s+setup/i.test(content) || /ref\(|reactive\(|computed\(|watch\(/i.test(content))
                hasComposition = true;
            if (/export\s+default\s+\{\s*data\(\)/i.test(content) || /methods:\s*\{/i.test(content))
                hasOptions = true;
            if (/<Suspense/i.test(content))
                hasSuspense = true;
            if (/<Teleport/i.test(content))
                hasTeleport = true;
            if (/defineStore\(/i.test(content))
                hasPinia = true;
            if (/createStore\(/i.test(content))
                hasVuex = true;
        }
        const ts = Date.now();
        const emit = (reason, tag) => {
            this.signals.push({
                id: `fie-vue-${tag}-${ts}`,
                analyzerId: this.name,
                analyzerType: 'framework',
                framework: 'Vue',
                category: index_js_1.SignalCategory.FRAMEWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
                timestamp: ts,
                reasoning: reason,
                evidence: [],
                metadata: { vueFeature: tag },
                tags: [tag]
            });
        };
        if (hasComposition)
            emit('Detected Vue Composition API usage.', 'USES_COMPOSITION_API');
        if (hasOptions)
            emit('Detected Vue Options API usage.', 'USES_OPTIONS_API');
        if (hasSuspense)
            emit('Detected Vue Suspense boundaries.', 'USES_SUSPENSE');
        if (hasTeleport)
            emit('Detected Vue Teleport usage.', 'USES_TELEPORT');
        if (hasPinia)
            emit('Detected Pinia store.', 'USES_PINIA');
        if (hasVuex)
            emit('Detected Vuex store.', 'USES_VUEX');
        this.metadata.stateManagement = hasPinia ? 'Pinia' : (hasVuex ? 'Vuex' : 'Vue State');
    }
    async analyze() {
        return this.signals;
    }
    getMetadata() {
        return this.metadata;
    }
    dispose() { }
}
exports.VueAdapter = VueAdapter;
//# sourceMappingURL=adapter.js.map