"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RIEDoctor = void 0;
const rie_engine_js_1 = require("../engine/rie-engine.js");
const index_js_1 = require("../../framework-intelligence/index.js");
const shared_1 = require("@uvt/shared");
class RIEDoctor {
    static async runDiagnostics(cwd) {
        const start = Date.now();
        shared_1.logger.info('Starting Intelligence Engine Diagnostics...\n');
        const rieEngine = new rie_engine_js_1.RepositoryIntelligenceEngine(cwd);
        const rieResult = await rieEngine.scan(cwd, true);
        const registry = new index_js_1.FrameworkRegistry();
        registry.register(new index_js_1.ReactAdapter());
        registry.register(new index_js_1.NextAdapter());
        registry.register(new index_js_1.VueAdapter());
        registry.register(new index_js_1.AngularAdapter());
        registry.register(new index_js_1.SvelteAdapter());
        registry.register(new index_js_1.AstroAdapter());
        registry.register(new index_js_1.StaticHtmlAdapter());
        const fieEngine = new index_js_1.FrameworkIntelligenceEngine(cwd, registry);
        const fieResult = await fieEngine.analyze(rieResult.metadata.framework, true);
        const m = rieResult.metadata;
        const f = fieResult.metadata;
        console.log(`Repository Intelligence Report`);
        console.log(`============================`);
        console.log(`Framework:       ${m.framework}`);
        console.log(`Build Tool:      ${m.buildTool}`);
        console.log(`Workspace:       ${m.workspace}`);
        console.log(`Package Manager: ${m.packageManager}`);
        console.log(`Routing:         ${m.routing}`);
        console.log(`Styling:         ${m.styling}`);
        console.log(`Authentication:  ${m.auth}`);
        console.log(`Realtime:        ${m.realtime}`);
        console.log(`Charts:          ${m.charts}`);
        console.log(`Maps:            ${m.maps}`);
        console.log(`Analytics:       ${m.analytics}`);
        console.log(`Payments:        ${m.payments}`);
        console.log(`CMS:             ${m.cms}`);
        console.log(`Animations:      ${m.animation}`);
        console.log(`Testing:         ${m.testing}`);
        console.log(`\nFramework Intelligence Report`);
        console.log(`=============================`);
        console.log(`Rendering Mode:  ${f.renderingStrategy || 'Unknown'}`);
        console.log(`State Management:${f.stateManagement || 'Native'}`);
        console.log(`Data Fetching:   ${f.dataFetching || 'Native fetch'}`);
        console.log(`Hydration:       ${f.ssr ? 'Required' : 'None'}`);
        console.log(`Semantic Signals: ${fieResult.signals.map(s => s.tags?.[0]).join(', ') || 'None'}`);
        console.log(`\n============================`);
        console.log(`Recommendations:`);
        if (m.charts !== 'None') {
            console.log(` - Enable Chart Stabilizer (Detected ${m.charts})`);
        }
        if (m.animation !== 'None') {
            console.log(` - Enable Animation Stabilizer (Detected ${m.animation})`);
        }
        if (m.realtime !== 'None') {
            console.log(` - Enable Network Muting for Realtime (Detected ${m.realtime})`);
        }
        if (f.dataFetching && f.dataFetching !== 'Native fetch') {
            console.log(` - Enable Async Data Stabilizer (Detected ${f.dataFetching})`);
        }
        if (fieResult.signals.some(s => s.tags?.includes('USES_SUSPENSE'))) {
            console.log(` - Enable Suspense Awaiter (Detected React Suspense)`);
        }
        if (m.charts === 'None' && m.animation === 'None' && m.realtime === 'None' && !f.dataFetching && fieResult.signals.length === 0) {
            console.log(` - Standard visual testing recommended. No complex dynamic layers detected.`);
        }
        console.log(`\nScan completed in ${Date.now() - start}ms.`);
    }
}
exports.RIEDoctor = RIEDoctor;
//# sourceMappingURL=rie-doctor.js.map