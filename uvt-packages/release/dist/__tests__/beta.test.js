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
const beta_certifier_js_1 = require("../beta/beta-certifier.js");
const beta_reporter_js_1 = require("../beta/beta-reporter.js");
(0, node_test_1.default)('RC-14 Public Beta Certification Gatekeeper Tests', async (t) => {
    const tmpDir = path.join(process.cwd(), '.temp_test_beta_' + Date.now());
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
    t.after(() => {
        try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
        catch { }
    });
    await t.test('Beta Certifier Engine verifies all 9 mandatory certification suites', async () => {
        const engine = new beta_certifier_js_1.BetaCertifierEngine(tmpDir);
        const report = await engine.runFullBetaCertification('UVT Beta Release');
        strict_1.default.equal(report.projectName, 'UVT Beta Release');
        strict_1.default.equal(report.suites.length, 9);
        strict_1.default.equal(report.passedSuitesCount, 9);
        strict_1.default.equal(report.failedSuitesCount, 0);
        strict_1.default.equal(report.decision, 'APPROVED_FOR_PUBLIC_BETA');
        strict_1.default.ok(report.readinessScore >= 95);
    });
    await t.test('Beta Certifier Reporter outputs HTML, JSON, MD, and official doc files', async () => {
        const engine = new beta_certifier_js_1.BetaCertifierEngine(tmpDir);
        const report = await engine.runFullBetaCertification('Reporter Beta App');
        const reporter = new beta_reporter_js_1.BetaCertifierReporter(tmpDir);
        const { htmlPath, jsonPath, mdPath, officialDocPath } = reporter.generateAllReports(report);
        strict_1.default.ok(fs.existsSync(htmlPath));
        strict_1.default.ok(fs.existsSync(jsonPath));
        strict_1.default.ok(fs.existsSync(mdPath));
        strict_1.default.ok(fs.existsSync(officialDocPath));
        const html = fs.readFileSync(htmlPath, 'utf8');
        strict_1.default.ok(html.includes('UVT Official Public Beta Certification Dashboard'));
        const officialDoc = fs.readFileSync(officialDocPath, 'utf8');
        strict_1.default.ok(officialDoc.includes('Official Public Beta Certification Report'));
        strict_1.default.ok(officialDoc.includes('APPROVED_FOR_PUBLIC_BETA'));
    });
});
//# sourceMappingURL=beta.test.js.map