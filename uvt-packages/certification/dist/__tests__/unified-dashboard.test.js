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
const unified_engine_js_1 = require("../dashboard/unified-engine.js");
const unified_reporter_js_1 = require("../dashboard/unified-reporter.js");
(0, node_test_1.default)('RC-11 Unified Regression Dashboard Engine Tests', async (t) => {
    const tmpDir = path.join(process.cwd(), '.temp_test_dash_' + Date.now());
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
    t.after(() => {
        try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
        catch { }
    });
    await t.test('Unified Regression Engine aggregates 10 subsystems', async () => {
        const engine = new unified_engine_js_1.UnifiedRegressionEngine(tmpDir);
        const report = await engine.aggregate('Unified Test App');
        strict_1.default.equal(report.projectName, 'Unified Test App');
        strict_1.default.equal(report.subsystems.length, 10);
        strict_1.default.ok(report.overallScore >= 0 && report.overallScore <= 100);
        strict_1.default.ok(report.totalPasses > 0);
        strict_1.default.ok(['EXCELLENT', 'GOOD', 'NEEDS_ATTENTION', 'CRITICAL'].includes(report.overallHealth));
    });
    await t.test('Unified Regression Reporter exports HTML, JSON, MD, and CSV outputs', async () => {
        const engine = new unified_engine_js_1.UnifiedRegressionEngine(tmpDir);
        const report = await engine.aggregate('Export Test App');
        const reporter = new unified_reporter_js_1.UnifiedRegressionReporter(tmpDir);
        const { htmlPath, jsonPath, mdPath, csvPath } = reporter.generateAllReports(report);
        strict_1.default.ok(fs.existsSync(htmlPath));
        strict_1.default.ok(fs.existsSync(jsonPath));
        strict_1.default.ok(fs.existsSync(mdPath));
        strict_1.default.ok(fs.existsSync(csvPath));
        const html = fs.readFileSync(htmlPath, 'utf8');
        strict_1.default.ok(html.includes('UVT Master Unified Regression Dashboard'));
        const csv = fs.readFileSync(csvPath, 'utf8');
        strict_1.default.ok(csv.includes('SubsystemID,SubsystemName'));
        strict_1.default.ok(csv.includes('framework'));
        strict_1.default.ok(csv.includes('golden-regression'));
    });
});
//# sourceMappingURL=unified-dashboard.test.js.map