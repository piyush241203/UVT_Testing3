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
const profiler_js_1 = require("../profiler.js");
const runner_js_1 = require("../runner.js");
const reporter_js_1 = require("../reporter.js");
(0, node_test_1.default)('RC-09 Performance Certification Engine Tests', async (t) => {
    const tmpDir = path.join(process.cwd(), '.temp_test_bench_' + Date.now());
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
    t.after(() => {
        try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
        catch { }
    });
    await t.test('Subsystem Profiler measures execution time and memory', async () => {
        const { result, metrics } = await profiler_js_1.SubsystemProfiler.profile('tcse', async () => {
            let sum = 0;
            for (let i = 0; i < 10000; i++)
                sum += i;
            return sum;
        }, { domNodesCount: 150 });
        strict_1.default.equal(typeof result, 'number');
        strict_1.default.ok(metrics.executionTimeMs > 0);
        strict_1.default.ok(metrics.memoryHeapUsedMb >= 0);
        strict_1.default.equal(metrics.domNodesCount, 150);
    });
    await t.test('Performance Certification Runner executes all 10 subsystems', async () => {
        const runner = new runner_js_1.PerformanceCertificationRunner(tmpDir);
        const report = await runner.runAll('Test System');
        strict_1.default.equal(report.projectName, 'Test System');
        strict_1.default.equal(report.subsystems.length, 10);
        strict_1.default.ok(report.overallScore >= 0 && report.overallScore <= 100);
        strict_1.default.ok(['passed', 'warning', 'degraded', 'failed'].includes(report.overallStatus));
    });
    await t.test('Benchmark Reporter generates Console, HTML, JSON, and MD outputs', async () => {
        const runner = new runner_js_1.PerformanceCertificationRunner(tmpDir);
        const report = await runner.runAll('Reporter Test System');
        const reporter = new reporter_js_1.PerformanceReporter(tmpDir);
        const { htmlPath, jsonPath, mdPath } = reporter.generateAllReports(report);
        strict_1.default.ok(fs.existsSync(htmlPath));
        strict_1.default.ok(fs.existsSync(jsonPath));
        strict_1.default.ok(fs.existsSync(mdPath));
        const html = fs.readFileSync(htmlPath, 'utf8');
        strict_1.default.ok(html.includes('UVT Performance Certification Dashboard'));
        strict_1.default.ok(html.includes('Subsystem'));
        const json = fs.readFileSync(jsonPath, 'utf8');
        strict_1.default.ok(json.includes('subsystems'));
    });
});
//# sourceMappingURL=benchmark.test.js.map