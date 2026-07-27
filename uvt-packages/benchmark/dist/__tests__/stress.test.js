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
const stress_runner_js_1 = require("../stress/stress-runner.js");
const stress_reporter_js_1 = require("../stress/stress-reporter.js");
(0, node_test_1.default)('RC-12 Stress Testing Framework Tests', async (t) => {
    const tmpDir = path.join(process.cwd(), '.temp_test_stress_' + Date.now());
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
    t.after(() => {
        try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
        catch { }
    });
    await t.test('Stress Test Runner executes all 7 extreme scale scenarios', async () => {
        const runner = new stress_runner_js_1.StressTestRunner(tmpDir);
        const report = await runner.runAllScenarios('Stress Test Suite');
        strict_1.default.equal(report.projectName, 'Stress Test Suite');
        strict_1.default.equal(report.scenarios.length, 7);
        strict_1.default.ok(report.overallScore >= 0 && report.overallScore <= 100);
        strict_1.default.ok(['PASSED', 'DEGRADED', 'FAILED'].includes(report.overallStatus));
        const scenarioIds = report.scenarios.map((s) => s.id);
        strict_1.default.ok(scenarioIds.includes('scale_100_routes'));
        strict_1.default.ok(scenarioIds.includes('scale_500_routes'));
        strict_1.default.ok(scenarioIds.includes('scale_1000_routes'));
        strict_1.default.ok(scenarioIds.includes('scale_10000_components'));
        strict_1.default.ok(scenarioIds.includes('nested_layouts'));
        strict_1.default.ok(scenarioIds.includes('large_monorepo'));
        strict_1.default.ok(scenarioIds.includes('deep_dependency_graph'));
    });
    await t.test('Stress Test Reporter generates HTML, JSON, and MD outputs', async () => {
        const runner = new stress_runner_js_1.StressTestRunner(tmpDir);
        const report = await runner.runAllScenarios('Reporter Stress App');
        const reporter = new stress_reporter_js_1.StressTestReporter(tmpDir);
        const { htmlPath, jsonPath, mdPath } = reporter.generateAllReports(report);
        strict_1.default.ok(fs.existsSync(htmlPath));
        strict_1.default.ok(fs.existsSync(jsonPath));
        strict_1.default.ok(fs.existsSync(mdPath));
        const html = fs.readFileSync(htmlPath, 'utf8');
        strict_1.default.ok(html.includes('UVT Extreme Stress Testing Dashboard'));
        const md = fs.readFileSync(mdPath, 'utf8');
        strict_1.default.ok(md.includes('Scale Performance Matrix'));
    });
});
//# sourceMappingURL=stress.test.js.map