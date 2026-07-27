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
(0, node_test_1.describe)('RC-07 Artifact Validation Engine 2.0 Tests', () => {
    const tempDir = path.resolve(process.cwd(), '.temp-validator-test');
    (0, node_test_1.test)('4-Phase Lifecycle: validates valid package.json across Parse, Compile, Execute, and Dry Run', async () => {
        fs.mkdirSync(tempDir, { recursive: true });
        const pkgPath = path.join(tempDir, 'package.json');
        fs.writeFileSync(pkgPath, JSON.stringify({ name: 'valid-app', version: '1.0.0' }, null, 2));
        const engine = new index_js_1.ArtifactValidationEngine2();
        const result = await engine.validateArtifact(pkgPath, 'package.json');
        node_assert_1.default.strictEqual(result.passed, true);
        node_assert_1.default.strictEqual(result.phases.parse.passed, true);
        node_assert_1.default.strictEqual(result.phases.compile.passed, true);
        node_assert_1.default.strictEqual(result.phases.execute.passed, true);
        node_assert_1.default.strictEqual(result.phases.dryRun.passed, true);
        node_assert_1.default.strictEqual(result.autoRegenerated, false);
    });
    (0, node_test_1.test)('Auto-Regeneration Trigger: automatically heals corrupted artifact on failure', async () => {
        fs.mkdirSync(tempDir, { recursive: true });
        const brokenPath = path.join(tempDir, 'broken.json');
        fs.writeFileSync(brokenPath, '{ name: "broken", invalid syntax }');
        const engine = new index_js_1.ArtifactValidationEngine2();
        const result = await engine.validateArtifact(brokenPath, 'package.json', (filePath) => {
            // Auto-regeneration fix callback
            fs.writeFileSync(filePath, JSON.stringify({ name: 'healed-app', version: '1.0.0' }, null, 2));
        });
        node_assert_1.default.strictEqual(result.passed, true);
        node_assert_1.default.strictEqual(result.autoRegenerated, true);
        node_assert_1.default.strictEqual(result.phases.parse.passed, true);
    });
    (0, node_test_1.test)('Reporter Output: renders Console, HTML, JSON, and Markdown validation reports', async () => {
        fs.mkdirSync(tempDir, { recursive: true });
        const validConfigPath = path.join(tempDir, 'uvt.config.ts');
        fs.writeFileSync(validConfigPath, 'export default { provider: "percy" };');
        const engine = new index_js_1.ArtifactValidationEngine2();
        const res = await engine.validateArtifact(validConfigPath, 'uvt-config');
        const reporter = new index_js_1.ArtifactValidationReporter();
        const report = engine.compileSuiteReport([res]);
        const consoleStr = reporter.renderConsole(report);
        node_assert_1.default.ok(consoleStr.includes('ARTIFACT VALIDATION ENGINE 2.0 REPORT'));
        node_assert_1.default.ok(consoleStr.includes('✔ ALL PASSED 100%'));
        const htmlStr = reporter.renderHTML(report);
        node_assert_1.default.ok(htmlStr.includes('<!DOCTYPE html>'));
        const mdStr = reporter.renderMarkdown(report);
        node_assert_1.default.ok(mdStr.includes('# Artifact Validation Engine 2.0 Report'));
        const files = reporter.saveReportFiles(report, tempDir);
        node_assert_1.default.ok(fs.existsSync(files.htmlPath));
        node_assert_1.default.ok(fs.existsSync(files.mdPath));
        node_assert_1.default.ok(fs.existsSync(files.jsonPath));
        fs.rmSync(tempDir, { recursive: true, force: true });
    });
});
//# sourceMappingURL=artifact-validator.test.js.map