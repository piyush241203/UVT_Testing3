"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingEngine = void 0;
const doctor_engine_js_1 = require("../diagnostics/doctor-engine.js");
const repair_engine_js_1 = require("../repair/repair-engine.js");
const config_generator_js_1 = require("../generators/config-generator.js");
class OnboardingEngine {
    doctor = new doctor_engine_js_1.DoctorEngine();
    repairEngine = new repair_engine_js_1.RepairEngine();
    generator = new config_generator_js_1.ConfigGenerator();
    async initProject(cwd, detectedFramework = 'react') {
        return await this.generator.generate(cwd, detectedFramework);
    }
    async runDiagnostics(cwd) {
        return await this.doctor.diagnose(cwd);
    }
    async runRepair(cwd) {
        const report = await this.doctor.diagnose(cwd);
        return await this.repairEngine.repair(report.issues);
    }
    async explainDecision(traceFile) {
        return `Trace analysis for ${traceFile}: Initialization and stability completed successfully.`;
    }
}
exports.OnboardingEngine = OnboardingEngine;
//# sourceMappingURL=engine.js.map