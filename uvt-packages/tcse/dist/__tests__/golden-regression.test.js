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
(0, node_test_1.describe)('Universal Visual Testing — Golden Regression Suite', () => {
    function findMonorepoRoot(startDir) {
        let current = startDir;
        while (current && current !== path.parse(current).root) {
            if (fs.existsSync(path.join(current, 'pnpm-workspace.yaml'))) {
                return current;
            }
            current = path.dirname(current);
        }
        return startDir;
    }
    const monorepoRoot = findMonorepoRoot(process.cwd());
    const examplesDir = path.join(monorepoRoot, 'examples');
    const frameworkDemos = [
        { name: 'react-demo', framework: 'react' },
        { name: 'next-demo', framework: 'next' },
        { name: 'vue-demo', framework: 'vue' },
        { name: 'html-demo', framework: 'html' },
        { name: 'angular-demo', framework: 'angular' },
        { name: 'svelte-demo', framework: 'svelte' },
        { name: 'plain-php-demo', framework: 'php' },
        { name: 'laravel-demo', framework: 'laravel' }
    ];
    for (const demo of frameworkDemos) {
        (0, node_test_1.test)(`Golden Baseline: ${demo.name} (${demo.framework}) maintains clean package structure & dependency injection`, () => {
            const demoPath = path.join(examplesDir, demo.name);
            node_assert_1.default.ok(fs.existsSync(demoPath), `${demo.name} directory must exist.`);
            const pkgPath = path.join(demoPath, 'package.json');
            node_assert_1.default.ok(fs.existsSync(pkgPath), `${demo.name} package.json must exist.`);
            const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
            node_assert_1.default.ok(pkgContent.name, `${demo.name} must have a valid package name.`);
            // Verify self-contained uvt-packages directory was prepared
            const uvtPkgsDir = path.join(demoPath, 'uvt-packages');
            node_assert_1.default.ok(fs.existsSync(uvtPkgsDir), `${demo.name} uvt-packages directory must exist after prepare-release.`);
            // Verify @uvt/tcse and @uvt/core packages were injected
            node_assert_1.default.ok(fs.existsSync(path.join(uvtPkgsDir, 'tcse')), `${demo.name} must contain injected @uvt/tcse package.`);
            node_assert_1.default.ok(fs.existsSync(path.join(uvtPkgsDir, 'core')), `${demo.name} must contain injected @uvt/core package.`);
        });
    }
    (0, node_test_1.test)('Zero-op Isolation: Engine execution when disabled produces zero DOM mutations or pipeline side effects', async () => {
        const { TCSEEngine, TCSERegistry } = await import('../index.js');
        const registry = new TCSERegistry();
        const engine = new TCSEEngine(registry);
        let isDomMutated = false;
        const mockPage = {
            evaluate: async () => {
                isDomMutated = true;
                return [];
            }
        };
        const result = await engine.process({
            page: mockPage,
            config: { tcse: { enabled: false } }
        });
        node_assert_1.default.strictEqual(result.isZeroOp, true);
        node_assert_1.default.strictEqual(result.signals.length, 0);
        node_assert_1.default.strictEqual(result.decisions.length, 0);
        node_assert_1.default.strictEqual(isDomMutated, false, 'TCSE must NOT mutate DOM when disabled.');
    });
});
//# sourceMappingURL=golden-regression.test.js.map