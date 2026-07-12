"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIEDoctor = void 0;
const engine_js_1 = require("../engine/engine.js");
const shared_1 = require("@uvt/shared");
class AIEDoctor {
    static async runDiagnostics(cwd) {
        const start = Date.now();
        shared_1.logger.info('Starting AST Intelligence Engine Diagnostics...\n');
        const engine = new engine_js_1.ASTIntelligenceEngine(cwd);
        const result = await engine.scan();
        const meta = result.metadata;
        console.log(`AST Intelligence Report`);
        console.log(`============================`);
        console.log(`Files Parsed:    ${meta.parsedFilesCount}`);
        console.log(`Parse Time:      ${meta.parseTimeMs}ms`);
        console.log(`Signals Emitted: ${meta.totalSignalsGenerated}`);
        console.log(`\nComponent Classifications:`);
        for (const [cls, count] of Object.entries(meta.componentsClassified)) {
            console.log(`  - ${cls}: ${count} found`);
        }
        console.log(`\nDynamic Behaviors Detected:`);
        const dateCount = result.signals.filter(s => s.tags?.includes('USES_DYNAMIC_DATE')).length;
        const randomCount = result.signals.filter(s => s.tags?.includes('USES_RANDOM_VALUES') || s.tags?.includes('USES_UUID')).length;
        const timerCount = result.signals.filter(s => s.tags?.includes('USES_INTERVAL') || s.tags?.includes('USES_TIMEOUT') || s.tags?.includes('USES_ANIMATION_FRAME')).length;
        const networkCount = result.signals.filter(s => s.tags?.includes('USES_FETCH') || s.tags?.includes('USES_AXIOS')).length;
        console.log(`  - Date APIs:    ${dateCount}`);
        console.log(`  - Random IDs:   ${randomCount}`);
        console.log(`  - Timers:       ${timerCount}`);
        console.log(`  - Network APIs: ${networkCount}`);
        console.log(`\nRecommendations:`);
        if (dateCount > 0)
            console.log(' - Enable Date Stabilizer (Date APIs found)');
        if (randomCount > 0)
            console.log(' - Enable Math.random/UUID Mocking (Random generators found)');
        if (timerCount > 0)
            console.log(' - Enable Animation/Timer Mocking (Timers found)');
        console.log(`\nScan completed in ${Date.now() - start}ms.`);
    }
}
exports.AIEDoctor = AIEDoctor;
//# sourceMappingURL=aie-doctor.js.map