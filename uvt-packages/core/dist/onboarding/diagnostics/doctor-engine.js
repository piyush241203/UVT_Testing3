"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorEngine = void 0;
const environment_validator_js_1 = require("../environment/environment-validator.js");
class DoctorEngine {
    validator = new environment_validator_js_1.EnvironmentValidator();
    async diagnose(cwd) {
        const issues = await this.validator.validate();
        const isHealthy = !issues.some(i => i.severity === 'Error');
        return {
            isHealthy,
            issues,
            recommendations: issues.map(i => i.description)
        };
    }
}
exports.DoctorEngine = DoctorEngine;
//# sourceMappingURL=doctor-engine.js.map