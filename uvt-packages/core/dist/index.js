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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreEngine = exports.pluginRegistry = exports.PluginRegistry = exports.SelfHealingGenerator = exports.ArtifactValidator = exports.ArtifactWriter = exports.GeneratorPlanner = exports.buildCapabilityGraph = exports.CGE = exports.CapabilityGraphBuilder = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const playwright_1 = require("playwright");
const shared_1 = require("@uvt/shared");
const config_1 = require("@uvt/config");
const reporter_1 = require("@uvt/reporter");
const framework_react_1 = require("@uvt/framework-react");
const framework_next_1 = require("@uvt/framework-next");
const framework_vue_1 = require("@uvt/framework-vue");
const framework_angular_1 = require("@uvt/framework-angular");
const framework_svelte_1 = require("@uvt/framework-svelte");
const framework_php_1 = require("@uvt/framework-php");
const provider_playwright_1 = require("@uvt/provider-playwright");
const provider_percy_1 = require("@uvt/provider-percy");
// Import refined engine modules
const repository_analyzer_js_1 = require("./engines/repository-analyzer.js");
const network_analyzer_js_1 = require("./engines/network-analyzer.js");
const selective_testing_js_1 = require("./engines/selective-testing.js");
const html_framework_plugin_js_1 = require("./engines/html-framework-plugin.js");
__exportStar(require("./engines/project-scanner.js"), exports);
__exportStar(require("./engines/repository-analyzer.js"), exports);
__exportStar(require("./onboarding/index.js"), exports);
__exportStar(require("./build-management/index.js"), exports);
__exportStar(require("./cloud-sync/index.js"), exports);
__exportStar(require("./dynamic-engine/index.js"), exports);
// ==========================================
// RC-04 URAE — Public API
// ==========================================
var capability_graph_js_1 = require("./capability-graph/capability-graph.js");
Object.defineProperty(exports, "CapabilityGraphBuilder", { enumerable: true, get: function () { return capability_graph_js_1.CapabilityGraphBuilder; } });
Object.defineProperty(exports, "CGE", { enumerable: true, get: function () { return capability_graph_js_1.CapabilityGraphBuilder; } });
var repository_analyzer_js_2 = require("./engines/repository-analyzer.js");
Object.defineProperty(exports, "buildCapabilityGraph", { enumerable: true, get: function () { return repository_analyzer_js_2.buildCapabilityGraph; } });
var generator_planner_js_1 = require("./generator/generator-planner.js");
Object.defineProperty(exports, "GeneratorPlanner", { enumerable: true, get: function () { return generator_planner_js_1.GeneratorPlanner; } });
var artifact_writer_js_1 = require("./generator/artifact-writer.js");
Object.defineProperty(exports, "ArtifactWriter", { enumerable: true, get: function () { return artifact_writer_js_1.ArtifactWriter; } });
var artifact_validator_js_1 = require("./validation/artifact-validator.js");
Object.defineProperty(exports, "ArtifactValidator", { enumerable: true, get: function () { return artifact_validator_js_1.ArtifactValidator; } });
var self_healing_generator_js_1 = require("./validation/self-healing-generator.js");
Object.defineProperty(exports, "SelfHealingGenerator", { enumerable: true, get: function () { return self_healing_generator_js_1.SelfHealingGenerator; } });
// ==========================================
// Plugin Registry
// ==========================================
class PluginRegistry {
    frameworks = new Map();
    providers = new Map();
    registerFramework(plugin) {
        this.frameworks.set(plugin.name, plugin);
        shared_1.logger.debug(`Registered framework plugin: ${plugin.name}`);
    }
    registerProvider(plugin) {
        this.providers.set(plugin.name, plugin);
        shared_1.logger.debug(`Registered provider plugin: ${plugin.name}`);
    }
    getFramework(name) {
        return this.frameworks.get(name);
    }
    getProvider(name) {
        return this.providers.get(name);
    }
    getFrameworks() {
        return Array.from(this.frameworks.values());
    }
}
exports.PluginRegistry = PluginRegistry;
exports.pluginRegistry = new PluginRegistry();
// Register built-in plugins
exports.pluginRegistry.registerFramework(new framework_react_1.ReactFrameworkPlugin());
exports.pluginRegistry.registerFramework(new framework_next_1.NextFrameworkPlugin());
exports.pluginRegistry.registerFramework(new framework_vue_1.VueFrameworkPlugin());
exports.pluginRegistry.registerFramework(new framework_angular_1.AngularFrameworkPlugin());
exports.pluginRegistry.registerFramework(new framework_svelte_1.SvelteFrameworkPlugin());
exports.pluginRegistry.registerFramework(new framework_php_1.PhpFrameworkPlugin());
exports.pluginRegistry.registerFramework(new html_framework_plugin_js_1.HtmlFrameworkPlugin());
exports.pluginRegistry.registerProvider(new provider_playwright_1.PlaywrightProvider());
exports.pluginRegistry.registerProvider(new provider_percy_1.PercyProvider());
// ==========================================
// Core Engine
// ==========================================
class CoreEngine {
    cwd;
    config;
    constructor(cwd) {
        this.cwd = cwd;
    }
    async initialize() {
        this.config = await (0, config_1.loadConfig)(this.cwd);
        shared_1.logger.info(`Initialized Core Engine. Provider: ${this.config.provider}, Framework: ${this.config.framework}`);
    }
    async getFrameworkDetails() {
        if (this.config.framework !== 'auto') {
            return { name: this.config.framework, confidence: 1.0, evidence: ['Explicitly specified in config.'] };
        }
        const context = await (0, repository_analyzer_js_1.createRepoContext)(this.cwd);
        const resolved = await (0, repository_analyzer_js_1.resolveFrameworkAsync)(context, exports.pluginRegistry.getFrameworks());
        return {
            name: resolved.plugin.name,
            confidence: resolved.confidence,
            evidence: resolved.evidence
        };
    }
    async generate() {
        const frameworkDetails = await this.getFrameworkDetails();
        let frameworkPlugin = exports.pluginRegistry.getFramework(frameworkDetails.name);
        if (!frameworkPlugin) {
            frameworkPlugin = {
                name: 'generic',
                apiVersion: 1,
                detect: async () => ({ confidence: 0.1, evidence: [] }),
                discoverRoutes: async () => [
                    { name: 'Home', url: '/' }
                ]
            };
        }
        const context = await (0, repository_analyzer_js_1.createRepoContext)(this.cwd);
        const routes = await frameworkPlugin.discoverRoutes(context);
        const testsDir = path.join(this.cwd, 'tests', 'generated');
        fs.mkdirSync(testsDir, { recursive: true });
        return this.generateSpecFiles(testsDir, routes);
    }
    async run(options = {}) {
        const startTime = Date.now();
        // Framework detection using structured evidence
        const frameworkDetails = await this.getFrameworkDetails();
        shared_1.logger.info(`Framework detected: "${frameworkDetails.name}" (confidence: ${frameworkDetails.confidence})`);
        frameworkDetails.evidence.forEach(ev => shared_1.logger.debug(`  - Evidence: ${ev}`));
        // Load framework plugin
        let frameworkPlugin = exports.pluginRegistry.getFramework(frameworkDetails.name);
        if (!frameworkPlugin) {
            // Fallback/Generic Framework Plugin
            frameworkPlugin = {
                name: 'generic',
                apiVersion: 1,
                detect: async () => ({ confidence: 0.1, evidence: [] }),
                discoverRoutes: async () => [
                    { name: 'Home', url: '/' }
                ]
            };
        }
        shared_1.logger.step('ROUTE DISCOVERY', `Discovering routes using framework plugin: ${frameworkPlugin.name}...`);
        const context = await (0, repository_analyzer_js_1.createRepoContext)(this.cwd);
        let routes = await frameworkPlugin.discoverRoutes(context);
        shared_1.logger.success(`Discovered ${routes.length} total routes.`);
        // Git Selective Testing integration
        if (options.changed) {
            shared_1.logger.step('SELECTIVE TESTING', 'Checking git changes and component dependency tree...');
            const selectiveRes = await (0, selective_testing_js_1.getAffectedRoutes)(this.cwd, routes);
            routes = selectiveRes.affectedRoutes;
            shared_1.logger.success(`Selective testing filtered run list to ${routes.length} affected routes.`);
            if (routes.length === 0) {
                shared_1.logger.success('All visual tests are clean. No affected routes to test.');
                const emptyReport = {
                    projectName: path.basename(this.cwd),
                    timestamp: new Date().toISOString(),
                    provider: this.config.provider,
                    framework: frameworkDetails.name,
                    totalDuration: Date.now() - startTime,
                    summary: { total: 0, passed: 0, failed: 0, skipped: 0 },
                    results: []
                };
                return emptyReport;
            }
        }
        // Generate specifications
        shared_1.logger.step('TEST GENERATION', `Generating Playwright test specs...`);
        const specPath = await this.generate();
        shared_1.logger.success(`Playwright specs generated in ${specPath}`);
        // Initialize Provider Plugin
        const providerName = this.config.provider;
        const provider = exports.pluginRegistry.getProvider(providerName);
        if (!provider) {
            throw new Error(`Provider plugin "${providerName}" not registered.`);
        }
        shared_1.logger.step('PROVIDER', `Initializing provider: ${provider.name}`);
        await provider.initialize({ cwd: this.cwd, config: this.config, isSelective: !!options.changed });
        // Execute tests
        shared_1.logger.step('EXECUTION', `Running visual assertions on ${routes.length} routes...`);
        const results = [];
        const browser = await playwright_1.chromium.launch({ headless: true });
        const browserContext = await browser.newContext();
        const baseUrl = options.host && options.port
            ? `http://${options.host}:${options.port}`
            : `http://localhost:${options.port || 3000}`;
        for (const route of routes) {
            const testStart = Date.now();
            const testName = route.name.replace(/\s+/g, '-').toLowerCase();
            const fullUrl = route.url.startsWith('http') ? route.url : `${baseUrl}${route.url}`;
            shared_1.logger.info(`Running snapshot test for ${route.name} (${fullUrl})...`);
            try {
                const page = await browserContext.newPage();
                // Setup Network Analyzer to capture response logs
                const networkAnalyzer = new network_analyzer_js_1.NetworkAnalyzer();
                networkAnalyzer.setup(page);
                // Navigate
                await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });
                // Always use route name + URL path as snapshot name to guarantee Percy uniqueness.
                // document.title is NOT used because SPAs share the same title across all routes.
                const routePath = route.url.replace(/:/g, '_').replace(/\//g, '_').replace(/^_/, '') || 'home';
                const finalName = `${route.name} (${route.url})`;
                if (this.config.dynamicDetection) {
                    // ==========================================
                    // Dynamic Stabilization Engine (DSE) Flow
                    // ==========================================
                    const { DynamicContext, EventBus, DSERegistry, DynamicOrchestrator } = await import('./dynamic-engine/index.js');
                    const { LegacyNetworkAnalyzer } = await import('./dynamic-engine/legacy/legacy-network-analyzer.js');
                    const { LegacyASTAnalyzer } = await import('./dynamic-engine/legacy/legacy-ast-analyzer.js');
                    const { LegacyDOMAnalyzer } = await import('./dynamic-engine/legacy/legacy-dom-analyzer.js');
                    const { LegacyMaskingStabilizer } = await import('./dynamic-engine/legacy/legacy-masking-stabilizer.js');
                    const { LegacySnapshotProviderAdapter } = await import('./dynamic-engine/legacy/legacy-snapshot-provider.js');
                    const registry = new DSERegistry();
                    const eventBus = new EventBus();
                    const context = new DynamicContext({
                        config: this.config,
                        logger: shared_1.logger,
                        page,
                        registry,
                        eventBus,
                        frameworkMetadata: { frameworkName: frameworkDetails.name },
                        repositoryRoot: this.cwd,
                        frameworkName: frameworkDetails.name
                    });
                    // Register Legacy Analyzers
                    registry.registerAnalyzer(new LegacyNetworkAnalyzer(networkAnalyzer));
                    registry.registerAnalyzer(new LegacyASTAnalyzer());
                    registry.registerAnalyzer(new LegacyDOMAnalyzer());
                    // Gather local dynamic values for legacy masking
                    const { DynamicDetector } = await import('./engines/dynamic-detector.js');
                    const legacyDetector = new DynamicDetector(networkAnalyzer);
                    const localValues = legacyDetector.getLocalDynamicValues(this.cwd);
                    // Register Legacy Stabilizer
                    registry.registerStabilizer(new LegacyMaskingStabilizer(localValues));
                    // Register Legacy Provider
                    registry.registerSnapshotProvider(new LegacySnapshotProviderAdapter(provider));
                    const orchestrator = new DynamicOrchestrator(context);
                    await orchestrator.execute(fullUrl, provider.name, { name: finalName, route });
                }
                else {
                    // DSE disabled, fallback to raw snapshot
                    await provider.snapshot(page, { name: finalName, url: fullUrl, route });
                }
                await page.close();
                results.push({
                    name: route.name,
                    url: fullUrl,
                    status: 'passed',
                    screenshotPath: route.metadata?.screenshotPath,
                    diffPath: route.metadata?.diffPath,
                    duration: Date.now() - testStart
                });
            }
            catch (err) {
                shared_1.logger.error(`Snapshot test failed for ${route.name}: ${err.message}`);
                results.push({
                    name: route.name,
                    url: fullUrl,
                    status: 'failed',
                    error: err.message,
                    screenshotPath: route.metadata?.screenshotPath,
                    diffPath: route.metadata?.diffPath,
                    duration: Date.now() - testStart
                });
            }
        }
        await browser.close();
        shared_1.logger.step('FINALIZE', 'Finalizing visual comparison...');
        await provider.finalize();
        // Generate Reports
        shared_1.logger.step('REPORTS', 'Generating visual testing reports...');
        const reportDir = path.join(this.cwd, '.uvt', 'reports');
        const passedCount = results.filter(r => r.status === 'passed').length;
        const failedCount = results.filter(r => r.status === 'failed').length;
        const reportData = {
            projectName: path.basename(this.cwd),
            timestamp: new Date().toISOString(),
            provider: providerName,
            framework: frameworkDetails.name,
            totalDuration: Date.now() - startTime,
            summary: {
                total: results.length,
                passed: passedCount,
                failed: failedCount,
                skipped: 0
            },
            results
        };
        (0, reporter_1.generateJSONReport)(reportDir, reportData);
        (0, reporter_1.generateHTMLReport)(reportDir, reportData);
        shared_1.logger.success(`All visual tests completed. Passed: ${passedCount}, Failed: ${failedCount}`);
        return reportData;
    }
    generateSpecFiles(testsDir, routes) {
        routes.forEach(route => {
            const filename = `${route.name.replace(/\s+/g, '-').toLowerCase()}.spec.ts`;
            const specPath = path.join(testsDir, filename);
            const testName = route.name.replace(/'/g, "\\'");
            const code = `import { test } from '@playwright/test';

// Automated spec generated by UVT for route "${route.name}"
test('Route: ${testName}', async ({ page }) => {
  await page.goto('${route.url}', { waitUntil: 'networkidle' });
});
`;
            fs.writeFileSync(specPath, code, 'utf-8');
        });
        return testsDir;
    }
}
exports.CoreEngine = CoreEngine;
//# sourceMappingURL=index.js.map