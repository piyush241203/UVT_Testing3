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
const matrix_builder_js_1 = require("../matrix/matrix-builder.js");
const matrix_reporter_js_1 = require("../matrix/matrix-reporter.js");
(0, node_test_1.default)('RC-10 Official Compatibility Matrix Engine Tests', async (t) => {
    const tmpDir = path.join(process.cwd(), '.temp_test_matrix_' + Date.now());
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
    t.after(() => {
        try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
        catch { }
    });
    await t.test('Matrix Builder generates combinations across all 10 frameworks', async () => {
        const report = matrix_builder_js_1.CompatibilityMatrixBuilder.buildFullMatrix();
        strict_1.default.ok(report.totalCombinations > 0);
        strict_1.default.equal(report.frameworkSummaries.length, 10);
        strict_1.default.ok(report.overallScore >= 0 && report.overallScore <= 100);
        strict_1.default.ok(report.passRatePercent >= 0 && report.passRatePercent <= 100);
        const fwNames = report.frameworkSummaries.map((f) => f.framework);
        const expected = ['React', 'Next', 'Vue', 'Angular', 'Svelte', 'Astro', 'Nuxt', 'Remix', 'Laravel', 'PHP'];
        for (const exp of expected) {
            strict_1.default.ok(fwNames.includes(exp), `Missing expected framework: ${exp}`);
        }
    });
    await t.test('Matrix Reporter outputs Console, HTML, JSON, and MD reports', async () => {
        const report = matrix_builder_js_1.CompatibilityMatrixBuilder.buildFullMatrix();
        const reporter = new matrix_reporter_js_1.CompatibilityMatrixReporter(tmpDir);
        const { htmlPath, jsonPath, mdPath } = reporter.generateAllReports(report);
        strict_1.default.ok(fs.existsSync(htmlPath));
        strict_1.default.ok(fs.existsSync(jsonPath));
        strict_1.default.ok(fs.existsSync(mdPath));
        const html = fs.readFileSync(htmlPath, 'utf8');
        strict_1.default.ok(html.includes('UVT Official Compatibility Matrix Dashboard'));
        strict_1.default.ok(html.includes('React'));
        const json = fs.readFileSync(jsonPath, 'utf8');
        strict_1.default.ok(json.includes('frameworkSummaries'));
    });
});
//# sourceMappingURL=matrix.test.js.map