"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularAdapter = void 0;
const file_scanner_js_1 = require("../../utils/file-scanner.js");
const index_js_1 = require("../../../dynamic-engine/index.js");
class AngularAdapter {
    name = 'AngularAdapter';
    cwd;
    metadata = { framework: 'Angular' };
    signals = [];
    initialize(cwd) {
        this.cwd = cwd;
    }
    supports(frameworkName) {
        return frameworkName.includes('Angular');
    }
    async detect() {
        const files = await file_scanner_js_1.FastFileScanner.scan(this.cwd);
        const contents = await file_scanner_js_1.FastFileScanner.readFilesContent(files, 300);
        let hasStandalone = false;
        let hasNgModules = false;
        let hasSignals = false;
        let hasObservables = false;
        let hasHttpClient = false;
        let hasNgRx = false;
        let hasAsyncPipe = false;
        for (const { content } of contents) {
            if (/standalone:\s*true/i.test(content))
                hasStandalone = true;
            if (/@NgModule/i.test(content))
                hasNgModules = true;
            if (/signal\(/i.test(content) && /@angular\/core/.test(content))
                hasSignals = true;
            if (/Observable</i.test(content) || /rxjs/.test(content))
                hasObservables = true;
            if (/HttpClient/i.test(content))
                hasHttpClient = true;
            if (/@ngrx\/store/i.test(content))
                hasNgRx = true;
            if (/\|\s*async/i.test(content))
                hasAsyncPipe = true;
        }
        const ts = Date.now();
        const emit = (reason, tag) => {
            this.signals.push({
                id: `fie-angular-${tag}-${ts}`,
                analyzerId: this.name,
                analyzerType: 'framework',
                framework: 'Angular',
                category: index_js_1.SignalCategory.FRAMEWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
                timestamp: ts,
                reasoning: reason,
                evidence: [],
                metadata: { angularFeature: tag },
                tags: [tag]
            });
        };
        if (hasStandalone)
            emit('Detected Standalone Components.', 'USES_STANDALONE_COMPONENTS');
        if (hasNgModules)
            emit('Detected NgModules architecture.', 'USES_NG_MODULES');
        if (hasSignals)
            emit('Detected Angular Signals.', 'USES_SIGNALS');
        if (hasObservables)
            emit('Detected RxJS Observables.', 'USES_OBSERVABLES');
        if (hasHttpClient)
            emit('Detected HttpClient usage.', 'USES_HTTP_CLIENT');
        if (hasNgRx)
            emit('Detected NgRx store.', 'USES_NGRX');
        if (hasAsyncPipe)
            emit('Detected Async Pipe in templates.', 'USES_ASYNC_PIPE');
        this.metadata.stateManagement = hasNgRx ? 'NgRx' : (hasSignals ? 'Signals' : 'RxJS/Services');
        this.metadata.dataFetching = hasHttpClient ? 'HttpClient' : 'Unknown';
        this.metadata.reactivity = hasSignals ? 'Signals' : 'Zone.js';
    }
    async analyze() {
        return this.signals;
    }
    getMetadata() {
        return this.metadata;
    }
    dispose() { }
}
exports.AngularAdapter = AngularAdapter;
//# sourceMappingURL=adapter.js.map