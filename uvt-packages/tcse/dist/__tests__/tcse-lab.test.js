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
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const index_js_1 = require("../index.js");
(0, node_test_1.describe)('RC-08 Third Party Certification Lab Tests', () => {
    (0, node_test_1.test)('Scenario Completeness: TCSE_LAB_SCENARIOS contains 11 Ad provider scenarios & 8 certification groups', () => {
        node_assert_1.default.strictEqual(index_js_1.TCSE_LAB_SCENARIOS.length, 19);
        const adScenarios = index_js_1.TCSE_LAB_SCENARIOS.filter(s => s.group === 'ad');
        node_assert_1.default.strictEqual(adScenarios.length, 11);
        const requiredProviders = [
            'Google AdSense', 'Google Ad Manager', 'Amazon Ads', 'Meta Audience Network',
            'Taboola', 'Outbrain', 'Media.net', 'Criteo', 'RevContent', 'Affiliate Network', 'Internal Marketing'
        ];
        for (const provider of requiredProviders) {
            const found = adScenarios.find(s => s.provider === provider);
            node_assert_1.default.ok(found, `Ad provider ${provider} must be present in lab scenarios.`);
        }
        const groups = new Set(index_js_1.TCSE_LAB_SCENARIOS.map(s => s.group));
        node_assert_1.default.strictEqual(groups.size, 9);
    });
    (0, node_test_1.test)('7-Property Verification: TCSELabRunner achieves 100% pass rate with zero CLS & zero unapproved mutations', async () => {
        const runner = new index_js_1.TCSELabRunner();
        const results = await runner.runFullLab();
        node_assert_1.default.strictEqual(results.length, 19);
        for (const res of results) {
            node_assert_1.default.strictEqual(res.passed, true, `Scenario ${res.scenarioName} must pass all 7 property checks.`);
            node_assert_1.default.strictEqual(res.cls, 0.000, `Scenario ${res.scenarioName} must introduce zero CLS.`);
            node_assert_1.default.strictEqual(res.unapprovedDomMutations, 0, `Scenario ${res.scenarioName} must make 0 unapproved DOM mutations.`);
            node_assert_1.default.strictEqual(res.propertyChecks.length, 7);
        }
    });
    (0, node_test_1.test)('TCSELabReporter Output: compiles summary and saves HTML, JSON, and Markdown reports', async () => {
        const runner = new index_js_1.TCSELabRunner();
        const reporter = new index_js_1.TCSELabReporter();
        const results = await runner.runFullLab();
        const summary = reporter.compileLabSummary(results);
        node_assert_1.default.strictEqual(summary.totalScenarios, 19);
        node_assert_1.default.strictEqual(summary.passedScenarios, 19);
        node_assert_1.default.strictEqual(summary.overallScore, 100);
        node_assert_1.default.strictEqual(summary.averageCls, 0.000);
        node_assert_1.default.strictEqual(summary.unapprovedDomMutations, 0);
        const consoleStr = reporter.renderConsole(summary);
        node_assert_1.default.ok(consoleStr.includes('THIRD-PARTY CERTIFICATION LAB SCORECARD'));
        const mdStr = reporter.renderMarkdown(summary);
        node_assert_1.default.ok(mdStr.includes('# TCSE Third-Party Certification Lab Report'));
        const htmlStr = reporter.renderHTML(summary);
        node_assert_1.default.ok(htmlStr.includes('<!DOCTYPE html>'));
        const tempDir = path.resolve(process.cwd(), '.temp-tcse-lab-out');
        fs.mkdirSync(tempDir, { recursive: true });
        const files = reporter.saveLabReports(summary, tempDir);
        node_assert_1.default.ok(fs.existsSync(files.htmlPath));
        node_assert_1.default.ok(fs.existsSync(files.mdPath));
        node_assert_1.default.ok(fs.existsSync(files.jsonPath));
        fs.rmSync(tempDir, { recursive: true, force: true });
    });
});
//# sourceMappingURL=tcse-lab.test.js.map