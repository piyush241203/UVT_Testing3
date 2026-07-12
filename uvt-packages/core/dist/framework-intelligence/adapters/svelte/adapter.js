"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvelteAdapter = void 0;
const file_scanner_js_1 = require("../../utils/file-scanner.js");
const index_js_1 = require("../../../dynamic-engine/index.js");
class SvelteAdapter {
    name = 'SvelteAdapter';
    cwd;
    metadata = { framework: 'Svelte' };
    signals = [];
    initialize(cwd) {
        this.cwd = cwd;
    }
    supports(frameworkName) {
        return frameworkName.includes('Svelte');
    }
    async detect() {
        const files = await file_scanner_js_1.FastFileScanner.scan(this.cwd);
        const contents = await file_scanner_js_1.FastFileScanner.readFilesContent(files, 300);
        let hasStores = false;
        let hasReactivity = false;
        let hasTransitions = false;
        let hasSvelteKitLoad = false;
        let hasFormActions = false;
        let isSvelteKit = files.some(f => f.includes('+page.svelte') || f.includes('+layout.svelte'));
        for (const { content, path: filePath } of contents) {
            if (/writable\(|readable\(|derived\(/i.test(content))
                hasStores = true;
            if (/\$:/i.test(content))
                hasReactivity = true;
            if (/transition:fade|transition:slide|transition:fly/i.test(content))
                hasTransitions = true;
            if (/export\s+(const|async\s+function)\s+load/i.test(content))
                hasSvelteKitLoad = true;
            if (/export\s+const\s+actions\s*=/i.test(content))
                hasFormActions = true;
        }
        const ts = Date.now();
        const emit = (reason, tag) => {
            this.signals.push({
                id: `fie-svelte-${tag}-${ts}`,
                analyzerId: this.name,
                analyzerType: 'framework',
                framework: isSvelteKit ? 'SvelteKit' : 'Svelte',
                category: index_js_1.SignalCategory.FRAMEWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
                timestamp: ts,
                reasoning: reason,
                evidence: [],
                metadata: { svelteFeature: tag },
                tags: [tag]
            });
        };
        if (hasStores)
            emit('Detected Svelte Stores.', 'USES_STORES');
        if (hasReactivity)
            emit('Detected Reactive Statements ($:).', 'USES_REACTIVE_STATEMENTS');
        if (hasTransitions)
            emit('Detected Svelte Transitions.', 'USES_TRANSITIONS');
        if (hasSvelteKitLoad)
            emit('Detected SvelteKit Load functions.', 'USES_LOAD_FUNCTIONS');
        if (hasFormActions)
            emit('Detected SvelteKit Form Actions.', 'USES_FORM_ACTIONS');
        this.metadata.framework = isSvelteKit ? 'SvelteKit' : 'Svelte';
        this.metadata.routing = isSvelteKit ? 'SvelteKit Router' : 'Unknown';
        this.metadata.stateManagement = hasStores ? 'Svelte Stores' : 'Local State';
    }
    async analyze() {
        return this.signals;
    }
    getMetadata() {
        return this.metadata;
    }
    dispose() { }
}
exports.SvelteAdapter = SvelteAdapter;
//# sourceMappingURL=adapter.js.map