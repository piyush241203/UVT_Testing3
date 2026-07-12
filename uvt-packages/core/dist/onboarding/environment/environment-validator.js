"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentValidator = void 0;
class EnvironmentValidator {
    async validate() {
        const issues = [];
        const nodeVersion = process.version;
        const major = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
        if (major < 18) {
            issues.push({
                id: 'OUTDATED_NODE',
                description: `Node.js version ${nodeVersion} is unsupported. Please upgrade to v18+.`,
                severity: 'Error',
                canAutoRepair: false
            });
        }
        if (!process.env.PERCY_TOKEN) {
            issues.push({
                id: 'MISSING_PERCY_TOKEN',
                description: 'PERCY_TOKEN environment variable is not set. Cloud uploads may fail.',
                severity: 'Warning',
                canAutoRepair: false
            });
        }
        // In a full implementation, this would detect missing dependencies like playwright, etc.
        return issues;
    }
}
exports.EnvironmentValidator = EnvironmentValidator;
//# sourceMappingURL=environment-validator.js.map