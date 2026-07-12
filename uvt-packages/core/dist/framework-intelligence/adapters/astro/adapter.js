"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstroAdapter = void 0;
const file_scanner_js_1 = require("../../utils/file-scanner.js");
const index_js_1 = require("../../../dynamic-engine/index.js");
class AstroAdapter {
    name = 'AstroAdapter';
    cwd;
    metadata = { framework: 'Astro' };
    signals = [];
    initialize(cwd) {
        this.cwd = cwd;
    }
    supports(frameworkName) {
        return frameworkName.includes('Astro');
    }
    async detect() {
        const files = await file_scanner_js_1.FastFileScanner.scan(this.cwd);
        const contents = await file_scanner_js_1.FastFileScanner.readFilesContent(files, 300);
        let hasIslands = false;
        let hasViewTransitions = false;
        let hasMarkdown = false;
        let hasSSR = false;
        for (const { content, path: filePath } of contents) {
            if (/client:(load|idle|visible|media|only)/i.test(content))
                hasIslands = true;
            if (/<ViewTransitions/i.test(content) || /@astrojs\/transitions/.test(content))
                hasViewTransitions = true;
            if (/\.md$|\.mdx$/.test(filePath))
                hasMarkdown = true;
            if (/export\s+const\s+prerender\s*=\s*false/i.test(content) || /Astro\.request/i.test(content))
                hasSSR = true;
        }
        const ts = Date.now();
        const emit = (reason, tag) => {
            this.signals.push({
                id: `fie-astro-${tag}-${ts}`,
                analyzerId: this.name,
                analyzerType: 'framework',
                framework: 'Astro',
                category: index_js_1.SignalCategory.FRAMEWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
                timestamp: ts,
                reasoning: reason,
                evidence: [],
                metadata: { astroFeature: tag },
                tags: [tag]
            });
        };
        if (hasIslands)
            emit('Detected Astro Client Directives (Islands).', 'USES_CLIENT_DIRECTIVES');
        if (hasViewTransitions)
            emit('Detected Astro ViewTransitions.', 'USES_VIEW_TRANSITIONS');
        if (hasMarkdown)
            emit('Detected Markdown/MDX integration.', 'USES_MARKDOWN');
        if (hasSSR)
            emit('Detected Astro SSR capabilities.', 'USES_SSR');
        this.metadata.renderingStrategy = hasSSR ? 'SSR + Islands Architecture' : 'SSG + Islands Architecture';
        this.metadata.ssr = hasSSR;
        this.metadata.transitions = hasViewTransitions ? 'ViewTransitions' : 'None';
    }
    async analyze() {
        return this.signals;
    }
    getMetadata() {
        return this.metadata;
    }
    dispose() { }
}
exports.AstroAdapter = AstroAdapter;
//# sourceMappingURL=adapter.js.map