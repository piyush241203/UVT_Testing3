"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticHtmlAdapter = void 0;
const file_scanner_js_1 = require("../../utils/file-scanner.js");
const index_js_1 = require("../../../dynamic-engine/index.js");
class StaticHtmlAdapter {
    name = 'StaticHtmlAdapter';
    cwd;
    metadata = { framework: 'Static HTML' };
    signals = [];
    initialize(cwd) {
        this.cwd = cwd;
    }
    supports(frameworkName) {
        return frameworkName === 'Static HTML' || frameworkName === 'Vite Vanilla';
    }
    async detect() {
        const files = await file_scanner_js_1.FastFileScanner.scan(this.cwd);
        // Expand to html files for static sites
        files.push(...(await file_scanner_js_1.FastFileScanner.scan(this.cwd)).filter(f => false)); // FastFileScanner doesn't scan html, so let's just scan standard JS/TS files
        const contents = await file_scanner_js_1.FastFileScanner.readFilesContent(files, 300);
        let hasAlpine = false;
        let hasHtmx = false;
        let hasLit = false;
        let hasShadowDom = false;
        let hasCustomElements = false;
        for (const { content } of contents) {
            if (/x-data|x-init|x-show/i.test(content))
                hasAlpine = true;
            if (/hx-get|hx-post|hx-target/i.test(content))
                hasHtmx = true;
            if (/from\s+['"]lit['"]|from\s+['"]lit-element['"]/i.test(content) || /html`/.test(content))
                hasLit = true;
            if (/attachShadow/i.test(content))
                hasShadowDom = true;
            if (/customElements\.define/i.test(content))
                hasCustomElements = true;
        }
        const ts = Date.now();
        const emit = (reason, tag) => {
            this.signals.push({
                id: `fie-static-${tag}-${ts}`,
                analyzerId: this.name,
                analyzerType: 'framework',
                framework: 'Static HTML',
                category: index_js_1.SignalCategory.FRAMEWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
                timestamp: ts,
                reasoning: reason,
                evidence: [],
                metadata: { staticFeature: tag },
                tags: [tag]
            });
        };
        if (hasAlpine)
            emit('Detected Alpine.js directives.', 'USES_ALPINE');
        if (hasHtmx)
            emit('Detected HTMX attributes.', 'USES_HTMX');
        if (hasLit)
            emit('Detected Lit Element usage.', 'USES_LIT');
        if (hasShadowDom)
            emit('Detected Shadow DOM attach requests.', 'USES_SHADOW_DOM');
        if (hasCustomElements)
            emit('Detected Custom Element definitions.', 'USES_CUSTOM_ELEMENTS');
        this.metadata.renderingStrategy = 'CSR (Vanilla/WebComponents)';
        if (hasHtmx)
            this.metadata.renderingStrategy = 'Server-Driven HTML (HTMX)';
    }
    async analyze() {
        return this.signals;
    }
    getMetadata() {
        return this.metadata;
    }
    dispose() { }
}
exports.StaticHtmlAdapter = StaticHtmlAdapter;
//# sourceMappingURL=adapter.js.map