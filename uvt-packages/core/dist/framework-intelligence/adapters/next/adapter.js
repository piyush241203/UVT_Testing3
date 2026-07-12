"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextAdapter = void 0;
const file_scanner_js_1 = require("../../utils/file-scanner.js");
const index_js_1 = require("../../../dynamic-engine/index.js");
class NextAdapter {
    name = 'NextAdapter';
    cwd;
    metadata = { framework: 'Next.js' };
    signals = [];
    initialize(cwd) {
        this.cwd = cwd;
    }
    supports(frameworkName) {
        return frameworkName === 'Next.js';
    }
    async detect() {
        const files = await file_scanner_js_1.FastFileScanner.scan(this.cwd);
        const contents = await file_scanner_js_1.FastFileScanner.readFilesContent(files, 300);
        let hasServerComponents = false;
        let hasClientComponents = false;
        let hasServerActions = false;
        let hasMetadataApi = false;
        let hasDynamicRoutes = false;
        let hasAppRouter = files.some(f => f.includes('/app/') || f.includes('\\app\\'));
        let hasPagesRouter = files.some(f => f.includes('/pages/') || f.includes('\\pages\\'));
        for (const { content, path: filePath } of contents) {
            if (/'use client'|"use client"/i.test(content))
                hasClientComponents = true;
            if (/'use server'|"use server"/i.test(content))
                hasServerActions = true;
            if (/generateMetadata/i.test(content))
                hasMetadataApi = true;
            // If it's the app router and doesn't have 'use client', it's likely a server component
            if (hasAppRouter && !/'use client'|"use client"/i.test(content) && content.includes('export default')) {
                hasServerComponents = true;
            }
            if (/\[.*\]/.test(filePath))
                hasDynamicRoutes = true;
        }
        const ts = Date.now();
        const emit = (reason, tag) => {
            this.signals.push({
                id: `fie-next-${tag}-${ts}`,
                analyzerId: this.name,
                analyzerType: 'framework',
                framework: 'Next.js',
                category: index_js_1.SignalCategory.FRAMEWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
                timestamp: ts,
                reasoning: reason,
                evidence: [],
                metadata: { nextFeature: tag },
                tags: [tag]
            });
        };
        if (hasServerComponents)
            emit('Detected React Server Components (RSC).', 'USES_SERVER_COMPONENTS');
        if (hasClientComponents)
            emit('Detected Client Components boundaries.', 'USES_CLIENT_COMPONENTS');
        if (hasServerActions)
            emit('Detected Next.js Server Actions.', 'USES_SERVER_ACTIONS');
        if (hasMetadataApi)
            emit('Detected dynamic Metadata API.', 'USES_METADATA_API');
        if (hasDynamicRoutes)
            emit('Detected dynamic routes (e.g., [id]).', 'USES_DYNAMIC_ROUTES');
        if (hasAppRouter)
            emit('Detected Next.js App Router.', 'USES_APP_ROUTER');
        if (hasPagesRouter)
            emit('Detected Next.js Pages Router.', 'USES_PAGES_ROUTER');
        this.metadata.renderingStrategy = hasAppRouter ? 'App Router (RSC + SSR)' : 'Pages Router (SSR / SSG)';
        this.metadata.ssr = true;
        this.metadata.routing = hasAppRouter ? 'Next App Router' : 'Next Pages Router';
    }
    async analyze() {
        return this.signals;
    }
    getMetadata() {
        return this.metadata;
    }
    dispose() { }
}
exports.NextAdapter = NextAdapter;
//# sourceMappingURL=adapter.js.map