"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const self_healing_engine_js_1 = require("../faults/self-healing-engine.js");
const recovery_reporter_js_1 = require("../faults/recovery-reporter.js");
(0, node_test_1.default)('RC-13 Failure Injection & Self-Healing Framework Tests', async (t) => {
    const tmpDir = path.join(process.cwd(), '.temp_test_faults_' + Date.now());
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
    t.after(() => {
        try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
        catch { }
    });
    await t.test('Self Healing Engine auto-repairs all 9 fault scenarios', async () => {
        const engine = new self_healing_engine_js_1.SelfHealingEngine(tmpDir);
        const report = await engine.runAllFaultScenarios('Fault Test App');
        strict_1.default.equal(report.projectName, 'Fault Test App');
        strict_1.default.equal(report.scenarios.length, 9);
        strict_1.default.equal(report.selfHealingScore, 100);
        strict_1.default.equal(report.manualInterventionCount, 0);
        strict_1.default.ok(['AUTO_REPAIRED', 'HEALED_WITH_FALLBACK'].includes(report.overallStatus));
        const faultIds = report.scenarios.map((s) => s.id);
        strict_1.default.ok(faultIds.includes('broken_package_json'));
        strict_1.default.ok(faultIds.includes('broken_yaml_config'));
        strict_1.default.ok(faultIds.includes('missing_config'));
        strict_1.default.ok(faultIds.includes('missing_lockfile'));
        strict_1.default.ok(faultIds.includes('broken_tsconfig'));
        strict_1.default.ok(faultIds.includes('wrong_port'));
        strict_1.default.ok(faultIds.includes('broken_scripts'));
        strict_1.default.ok(faultIds.includes('missing_dependencies'));
        strict_1.default.ok(faultIds.includes('corrupted_workflow'));
    });
    await t.test('Failure Recovery Reporter outputs HTML, JSON, and MD reports', async () => {
        const engine = new self_healing_engine_js_1.SelfHealingEngine(tmpDir);
        const report = await engine.runAllFaultScenarios('Reporter Fault App');
        const reporter = new recovery_reporter_js_1.FailureRecoveryReporter(tmpDir);
        const { htmlPath, jsonPath, mdPath } = reporter.generateAllReports(report);
        strict_1.default.ok(fs.existsSync(htmlPath));
        strict_1.default.ok(fs.existsSync(jsonPath));
        strict_1.default.ok(fs.existsSync(mdPath));
        const html = fs.readFileSync(htmlPath, 'utf8');
        strict_1.default.ok(html.includes('UVT Failure Injection & Self-Healing Dashboard'));
        const md = fs.readFileSync(mdPath, 'utf8');
        strict_1.default.ok(md.includes('Self-Healing Fault Recovery Matrix'));
    });
});
//# sourceMappingURL=faults.test.js.map