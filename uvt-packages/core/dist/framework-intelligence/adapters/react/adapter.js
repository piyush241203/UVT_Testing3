"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactAdapter = void 0;
const file_scanner_js_1 = require("../../utils/file-scanner.js");
const index_js_1 = require("../../../dynamic-engine/index.js");
class ReactAdapter {
    name = 'ReactAdapter';
    cwd;
    metadata = { framework: 'React' };
    signals = [];
    initialize(cwd) {
        this.cwd = cwd;
    }
    supports(frameworkName) {
        return frameworkName.includes('React');
    }
    async detect() {
        const files = await file_scanner_js_1.FastFileScanner.scan(this.cwd);
        const contents = await file_scanner_js_1.FastFileScanner.readFilesContent(files, 300); // Higher limit for react hook search
        let hasSuspense = false;
        let hasLazy = false;
        let hasReactQuery = false;
        let hasRedux = false;
        let hasZustand = false;
        let hasCustomHooks = false;
        for (const { content } of contents) {
            if (/<Suspense/i.test(content))
                hasSuspense = true;
            if (/React\.lazy\(|lazy\(/i.test(content))
                hasLazy = true;
            if (/useQuery\(|useMutation\(/i.test(content))
                hasReactQuery = true;
            if (/useSelector\(|useDispatch\(/i.test(content))
                hasRedux = true;
            if (/create\(\s*set\s*=>/i.test(content))
                hasZustand = true;
            if (/function\s+use[A-Z]/i.test(content) || /const\s+use[A-Z][a-zA-Z0-9_]*\s*=\s*\(/i.test(content))
                hasCustomHooks = true;
        }
        const ts = Date.now();
        const emit = (reason, tag) => {
            this.signals.push({
                id: `fie-react-${tag}-${ts}`,
                analyzerId: this.name,
                analyzerType: 'framework',
                framework: 'React',
                category: index_js_1.SignalCategory.FRAMEWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
                timestamp: ts,
                reasoning: reason,
                evidence: [],
                metadata: { reactFeature: tag },
                tags: [tag]
            });
        };
        if (hasSuspense)
            emit('Detected React Suspense boundaries.', 'USES_SUSPENSE');
        if (hasLazy)
            emit('Detected React.lazy() loading.', 'USES_LAZY_LOADING');
        if (hasReactQuery)
            emit('Detected React Query data fetching.', 'USES_REACT_QUERY');
        if (hasRedux)
            emit('Detected Redux state management.', 'USES_REDUX');
        if (hasZustand)
            emit('Detected Zustand stores.', 'USES_ZUSTAND');
        if (hasCustomHooks)
            emit('Detected custom hook implementations.', 'USES_CUSTOM_HOOK');
        this.metadata.renderingStrategy = 'CSR (Client Side Rendering)';
        if (hasSuspense)
            this.metadata.renderingStrategy += ' with Suspense';
        this.metadata.stateManagement = hasRedux ? 'Redux' : (hasZustand ? 'Zustand' : 'React State');
        this.metadata.dataFetching = hasReactQuery ? 'React Query' : 'Native fetch/axios';
    }
    async analyze() {
        return this.signals;
    }
    getMetadata() {
        return this.metadata;
    }
    dispose() { }
}
exports.ReactAdapter = ReactAdapter;
//# sourceMappingURL=adapter.js.map