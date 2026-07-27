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
(0, node_test_1.describe)('RC-05 Real Repository Certification Suite (RRCS) Tests', () => {
    (0, node_test_1.test)('Registry Completeness: REAL_REPO_CERTIFICATION_REGISTRY contains all 10 required real-world frameworks', () => {
        const requiredFrameworks = ['react', 'next', 'vue', 'angular', 'svelte', 'astro', 'nuxt', 'remix', 'laravel', 'php'];
        node_assert_1.default.strictEqual(index_js_1.REAL_REPO_CERTIFICATION_REGISTRY.length, 10);
        for (const fw of requiredFrameworks) {
            const found = index_js_1.REAL_REPO_CERTIFICATION_REGISTRY.find(r => r.framework === fw);
            node_assert_1.default.ok(found, `Framework ${fw} must be present in certification registry.`);
            node_assert_1.default.ok(found?.repositoryUrl.startsWith('https://github.com/'));
            node_assert_1.default.ok(found?.expectedRouteCount > 0);
        }
    });
    (0, node_test_1.test)('RepoCache Management: cache directory and repository path resolution', () => {
        const tempCacheDir = path.resolve(process.cwd(), '.temp-test-cache');
        const cache = new index_js_1.RepoCache(tempCacheDir);
        node_assert_1.default.strictEqual(cache.getCacheDir(), tempCacheDir);
        node_assert_1.default.strictEqual(cache.hasRepo('non-existent-repo'), false);
        cache.clearCache();
        if (fs.existsSync(tempCacheDir)) {
            fs.rmSync(tempCacheDir, { recursive: true, force: true });
        }
    });
    (0, node_test_1.test)('RepoValidator Scoring: accurately evaluates expected vs actual analysis results', () => {
        const validator = new index_js_1.RepoValidator();
        const meta = index_js_1.REAL_REPO_CERTIFICATION_REGISTRY[0]; // React
        const perfectReport = validator.validateRepository(meta, {
            frameworkDetected: 'react',
            buildToolDetected: 'vite',
            routingDetected: 'react-router',
            routeCountDetected: 21,
            configArtifactGenerated: true,
            workflowArtifactGenerated: true
        });
        node_assert_1.default.strictEqual(perfectReport.passed, true);
        node_assert_1.default.strictEqual(perfectReport.score, 100);
        node_assert_1.default.strictEqual(perfectReport.items.length, 5);
    });
    (0, node_test_1.test)('CertificationReporter Summary: calculates Repository, Framework, and Automation scores', () => {
        const reporter = new index_js_1.CertificationReporter();
        const mockReports = index_js_1.REAL_REPO_CERTIFICATION_REGISTRY.map(meta => ({
            repoId: meta.id,
            repoName: meta.name,
            framework: meta.framework,
            passed: true,
            score: 100,
            items: [],
            timestamp: Date.now()
        }));
        const summary = reporter.compileSuiteSummary(mockReports);
        node_assert_1.default.strictEqual(summary.totalRepositories, 10);
        node_assert_1.default.strictEqual(summary.passedRepositories, 10);
        node_assert_1.default.strictEqual(summary.repositoryScore, 100);
        node_assert_1.default.strictEqual(summary.frameworkScore, 100);
        node_assert_1.default.strictEqual(summary.automationScore, 100);
        node_assert_1.default.strictEqual(summary.overallScore, 100);
        node_assert_1.default.strictEqual(summary.frameworkScores.length, 10);
    });
    (0, node_test_1.test)('CertificationDashboard Output: renders HTML & Markdown dashboards and saves artifacts', () => {
        const reporter = new index_js_1.CertificationReporter();
        const mockReports = index_js_1.REAL_REPO_CERTIFICATION_REGISTRY.map(meta => ({
            repoId: meta.id,
            repoName: meta.name,
            framework: meta.framework,
            passed: true,
            score: 100,
            items: [{ name: 'Framework Detection', passed: true, expected: meta.expectedFramework, actual: meta.framework, score: 100 }],
            timestamp: Date.now()
        }));
        const summary = reporter.compileSuiteSummary(mockReports);
        const dashboard = new index_js_1.CertificationDashboard();
        const md = dashboard.renderMarkdown(summary);
        node_assert_1.default.ok(md.includes('# Real Repository Certification Suite (RRCS) — Dashboard'));
        node_assert_1.default.ok(md.includes('Overall Score'));
        const html = dashboard.renderHTML(summary);
        node_assert_1.default.ok(html.includes('<!DOCTYPE html>'));
        node_assert_1.default.ok(html.includes('Real Repository Certification Suite (RRCS)'));
        const tempOutDir = path.resolve(process.cwd(), '.temp-dash-out');
        fs.mkdirSync(tempOutDir, { recursive: true });
        const files = dashboard.saveDashboardFiles(summary, tempOutDir);
        node_assert_1.default.ok(fs.existsSync(files.htmlPath));
        node_assert_1.default.ok(fs.existsSync(files.mdPath));
        node_assert_1.default.ok(fs.existsSync(files.jsonPath));
        fs.rmSync(tempOutDir, { recursive: true, force: true });
    });
    (0, node_test_1.test)('CertificationRunner Suite Execution: executes full certification suite cleanly', async () => {
        const runner = new index_js_1.CertificationRunner();
        const summary = await runner.runFullSuite(index_js_1.REAL_REPO_CERTIFICATION_REGISTRY.slice(0, 2));
        node_assert_1.default.strictEqual(summary.totalRepositories, 2);
        node_assert_1.default.strictEqual(summary.passedRepositories, 2);
        node_assert_1.default.strictEqual(summary.overallScore, 100);
    });
});
//# sourceMappingURL=certification.test.js.map