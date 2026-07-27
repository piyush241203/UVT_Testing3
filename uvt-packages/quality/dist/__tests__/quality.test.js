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
(0, node_test_1.describe)('RC-06 Automation Quality Engine Tests', () => {
    (0, node_test_1.test)('RepoHealthAnalyzer: calculates health score and identifies lockfile & manifest deductions', () => {
        const analyzer = new index_js_1.RepoHealthAnalyzer();
        const metric = analyzer.analyze(process.cwd());
        node_assert_1.default.strictEqual(metric.key, 'repoHealth');
        node_assert_1.default.ok(metric.score >= 0 && metric.score <= 100);
        node_assert_1.default.strictEqual(metric.weight, 0.15);
        if (metric.deductions.length > 0) {
            const deduction = metric.deductions[0];
            node_assert_1.default.ok(deduction.pointsLost > 0);
            node_assert_1.default.ok(deduction.reason.length > 0);
            node_assert_1.default.ok(deduction.recommendation.length > 0);
        }
    });
    (0, node_test_1.test)('ConfidenceCalculator: calculates provider readiness and identifies missing PERCY_TOKEN deduction', () => {
        const calculator = new index_js_1.ConfidenceCalculator();
        const metric = calculator.calculateProviderReadiness(process.cwd(), { PERCY_TOKEN: '' });
        node_assert_1.default.strictEqual(metric.key, 'providerReadiness');
        node_assert_1.default.ok(metric.score <= 50, 'Score must suffer deduction when PERCY_TOKEN is missing');
        const tokenDeduction = metric.deductions.find(d => d.reason.includes('PERCY_TOKEN'));
        node_assert_1.default.ok(tokenDeduction, 'Must record explicit PERCY_TOKEN deduction');
        node_assert_1.default.strictEqual(tokenDeduction?.pointsLost, 50);
    });
    (0, node_test_1.test)('AutomationQualityEngine: evaluates all 8 metrics and calculates weighted overall score', () => {
        const engine = new index_js_1.AutomationQualityEngine();
        const report = engine.evaluate({
            frameworkName: 'React',
            frameworkConfidence: 0.95,
            routeCount: 21,
            env: { PERCY_TOKEN: 'web_test_token' }
        });
        node_assert_1.default.ok(report.overallScore >= 0 && report.overallScore <= 100);
        node_assert_1.default.ok(['EXCELLENT', 'GOOD', 'NEEDS_ATTENTION', 'CRITICAL'].includes(report.status));
        node_assert_1.default.strictEqual(Object.keys(report.metrics).length, 8);
        node_assert_1.default.ok(report.metrics.repoHealth);
        node_assert_1.default.ok(report.metrics.frameworkConfidence);
        node_assert_1.default.ok(report.metrics.routingConfidence);
        node_assert_1.default.ok(report.metrics.generatorAccuracy);
        node_assert_1.default.ok(report.metrics.ciAccuracy);
        node_assert_1.default.ok(report.metrics.artifactAccuracy);
        node_assert_1.default.ok(report.metrics.providerReadiness);
        node_assert_1.default.ok(report.metrics.automationCompleteness);
    });
    (0, node_test_1.test)('QualityReporter Output: renders colorized Console, Markdown, and HTML reports', () => {
        const engine = new index_js_1.AutomationQualityEngine();
        const report = engine.evaluate({
            frameworkName: 'Next.js',
            frameworkConfidence: 0.85,
            routeCount: 6
        });
        const reporter = new index_js_1.QualityReporter();
        const consoleStr = reporter.renderConsole(report);
        node_assert_1.default.ok(consoleStr.includes('AUTOMATION QUALITY SCORECARD'));
        node_assert_1.default.ok(consoleStr.includes('OVERALL AUTOMATION SCORE:'));
        const mdStr = reporter.renderMarkdown(report);
        node_assert_1.default.ok(mdStr.includes('# Automation Quality Report'));
        node_assert_1.default.ok(mdStr.includes('Overall Automation Score:'));
        const htmlStr = reporter.renderHTML(report);
        node_assert_1.default.ok(htmlStr.includes('<!DOCTYPE html>'));
        node_assert_1.default.ok(htmlStr.includes('Repository Automation Quality Scorecard'));
        const tempDir = path.resolve(process.cwd(), '.temp-quality-out');
        fs.mkdirSync(tempDir, { recursive: true });
        const files = reporter.saveReportFiles(report, tempDir);
        node_assert_1.default.ok(fs.existsSync(files.htmlPath));
        node_assert_1.default.ok(fs.existsSync(files.mdPath));
        node_assert_1.default.ok(fs.existsSync(files.jsonPath));
        fs.rmSync(tempDir, { recursive: true, force: true });
    });
});
//# sourceMappingURL=quality.test.js.map