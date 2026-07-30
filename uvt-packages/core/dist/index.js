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
exports.CoreEngine = exports.pluginRegistry = exports.PluginRegistry = exports.SelfHealingGenerator = exports.ArtifactValidator = exports.ArtifactWriter = exports.GeneratorPlanner = exports.buildCapabilityGraph = exports.CGE = exports.CapabilityGraphBuilder = exports.CORE_PACKAGE_VERSION = exports.runSharedRuntimeTests = exports.runPipelineTests = exports.EventBus = exports.DSERegistry = exports.DynamicContext = exports.PipelineEngine = exports.UCSEngine = exports.UBMSEngine = exports.OnboardingEngine = exports.scanProject = exports.createRepoContext = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const http = __importStar(require("http"));
const net = __importStar(require("net"));
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
// export * from '@uvt/tcse';
var repository_analyzer_js_2 = require("./engines/repository-analyzer.js");
Object.defineProperty(exports, "createRepoContext", { enumerable: true, get: function () { return repository_analyzer_js_2.createRepoContext; } });
var project_scanner_js_1 = require("./engines/project-scanner.js");
Object.defineProperty(exports, "scanProject", { enumerable: true, get: function () { return project_scanner_js_1.scanProject; } });
var engine_js_1 = require("./onboarding/engine/engine.js");
Object.defineProperty(exports, "OnboardingEngine", { enumerable: true, get: function () { return engine_js_1.OnboardingEngine; } });
var engine_js_2 = require("./build-management/engine/engine.js");
Object.defineProperty(exports, "UBMSEngine", { enumerable: true, get: function () { return engine_js_2.UBMSEngine; } });
var engine_js_3 = require("./cloud-sync/engine/engine.js");
Object.defineProperty(exports, "UCSEngine", { enumerable: true, get: function () { return engine_js_3.UCSEngine; } });
var index_js_1 = require("./dynamic-engine/index.js");
Object.defineProperty(exports, "PipelineEngine", { enumerable: true, get: function () { return index_js_1.PipelineEngine; } });
Object.defineProperty(exports, "DynamicContext", { enumerable: true, get: function () { return index_js_1.DynamicContext; } });
Object.defineProperty(exports, "DSERegistry", { enumerable: true, get: function () { return index_js_1.DSERegistry; } });
Object.defineProperty(exports, "EventBus", { enumerable: true, get: function () { return index_js_1.EventBus; } });
Object.defineProperty(exports, "runPipelineTests", { enumerable: true, get: function () { return index_js_1.runPipelineTests; } });
Object.defineProperty(exports, "runSharedRuntimeTests", { enumerable: true, get: function () { return index_js_1.runSharedRuntimeTests; } });
exports.CORE_PACKAGE_VERSION = '0.1.0-alpha.1';
// ==========================================
// RC-04 URAE — Public API
// ==========================================
var capability_graph_js_1 = require("./capability-graph/capability-graph.js");
Object.defineProperty(exports, "CapabilityGraphBuilder", { enumerable: true, get: function () { return capability_graph_js_1.CapabilityGraphBuilder; } });
Object.defineProperty(exports, "CGE", { enumerable: true, get: function () { return capability_graph_js_1.CapabilityGraphBuilder; } });
var repository_analyzer_js_3 = require("./engines/repository-analyzer.js");
Object.defineProperty(exports, "buildCapabilityGraph", { enumerable: true, get: function () { return repository_analyzer_js_3.buildCapabilityGraph; } });
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
        // Auto-ensure local server is running on target port
        const targetPort = options.port || 3000;
        const localServer = await ensureLocalServer(this.cwd, targetPort, frameworkDetails.name);
        // Execute tests
        shared_1.logger.step('EXECUTION', `Running visual assertions on ${routes.length} routes...`);
        const results = [];
        try {
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
                    // Intercept .php downloads when running static/dev server without active PHP CGI
                    await page.route('**/*.php*', async (route, request) => {
                        try {
                            const response = await route.fetch();
                            const headers = response.headers();
                            if (headers['content-disposition'] || headers['content-type']?.includes('application/x-httpd-php') || !headers['content-type']?.includes('text/html')) {
                                const body = await response.text();
                                await route.fulfill({
                                    response,
                                    status: 200,
                                    contentType: 'text/html; charset=utf-8',
                                    body
                                });
                                return;
                            }
                            await route.continue();
                        }
                        catch {
                            await route.continue();
                        }
                    });
                    // Navigate - use 60s timeout for slow CI environments
                    await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 60000 });
                    // Extra stability wait: ensure DOM is fully loaded and JS has settled
                    await page.waitForLoadState('domcontentloaded');
                    await new Promise(resolve => setTimeout(resolve, 300));
                    // SPA hydration guard: for Vue/Svelte/React apps, wait until the framework
                    // root element actually has children rendered (not just an empty shell div).
                    const isSpa = ['vue', 'sveltekit', 'react', 'next', 'angular'].includes(frameworkDetails.name);
                    if (isSpa) {
                        const spaRoots = ['#app', '#root', '#__nuxt', 'svelte-component', '[data-sveltekit-preload-data]', 'app-root', '#angular-app'];
                        for (const sel of spaRoots) {
                            try {
                                const hasContent = await page.evaluate((selector) => {
                                    const el = document.querySelector(selector);
                                    return el !== null && el.children.length > 0;
                                }, sel);
                                if (hasContent)
                                    break;
                                // Wait up to 5s for the SPA root to have children
                                await page.waitForFunction((selector) => {
                                    const el = document.querySelector(selector);
                                    return el !== null && el.children.length > 0;
                                }, sel, { timeout: 5000 }).catch(() => { }); // silence timeout — next selector or fallback
                                break;
                            }
                            catch { }
                        }
                        // Additional settle time for SPA animations and async data
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
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
        finally {
            if (localServer.server) {
                try {
                    localServer.server.close();
                    shared_1.logger.debug('Closed embedded local web server.');
                }
                catch { }
            }
            if (localServer.proc) {
                try {
                    // Kill the spawned dev server (Vite / npm run dev / npm run preview)
                    const isWin = process.platform === 'win32';
                    if (isWin) {
                        // On Windows, spawned processes need to be killed via taskkill to include child processes
                        (await import('child_process')).execSync(`taskkill /PID ${localServer.proc.pid} /T /F`, { stdio: 'ignore' });
                    }
                    else {
                        localServer.proc.kill('SIGTERM');
                    }
                    shared_1.logger.debug(`Stopped dev server process (PID ${localServer.proc.pid}).`);
                }
                catch { }
            }
        }
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
/** Wait until a TCP port is accepting connections. Polls every 250ms, up to maxMs. */
async function waitForPort(port, maxMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
        const ok = await new Promise((res) => {
            const s = new net.Socket();
            s.setTimeout(300);
            s.on('connect', () => { s.destroy(); res(true); });
            s.on('timeout', () => { s.destroy(); res(false); });
            s.on('error', () => res(false));
            s.connect(port);
        });
        if (ok)
            return true;
        await new Promise(r => setTimeout(r, 250));
    }
    return false;
}
/** Kill any process occupying the specified port (Windows netstat/taskkill, Unix lsof/kill). */
async function killOccupiedPort(port) {
    const isWin = process.platform === 'win32';
    try {
        const cp = await import('child_process');
        if (isWin) {
            const out = cp.execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
            const lines = out.split('\n').filter(l => l.includes('LISTENING'));
            for (const line of lines) {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0' && pid !== String(process.pid)) {
                    shared_1.logger.info(`Terminating stale process PID ${pid} occupying port ${port}...`);
                    try {
                        cp.execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
                    }
                    catch { }
                }
            }
        }
        else {
            const pid = cp.execSync(`lsof -t -i:${port}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
            if (pid && pid !== String(process.pid)) {
                shared_1.logger.info(`Terminating stale process PID ${pid} occupying port ${port}...`);
                try {
                    cp.execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
                }
                catch { }
            }
        }
        await new Promise(r => setTimeout(r, 600)); // allow OS socket release
    }
    catch { }
}
async function ensureLocalServer(cwd, port, framework) {
    // ── 1. Check if a server is already running ──────────────────────────────
    const alreadyListening = await new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(500);
        socket.on('connect', () => { socket.destroy(); resolve(true); });
        socket.on('timeout', () => { socket.destroy(); resolve(false); });
        socket.on('error', () => { resolve(false); });
        socket.connect(port);
    });
    if (alreadyListening) {
        shared_1.logger.info(`Port ${port} is currently occupied. Terminating stale process to ensure fresh web server deployment...`);
        await killOccupiedPort(port);
    }
    shared_1.logger.step('SERVER', `Starting automatic local web server on port ${port}...`);
    const lowerFramework = framework?.toLowerCase() || '';
    // ── 2. Handle PHP & Laravel servers (Not using npm run) ────────────────
    if (lowerFramework === 'laravel') {
        shared_1.logger.info(`Spawning \`php artisan serve --port ${port}\` in ${cwd} to serve Laravel...`);
        const proc = (await import('child_process')).spawn('php', ['artisan', 'serve', `--port=${port}`], {
            cwd,
            shell: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            detached: false,
            env: { ...process.env }
        });
        proc.stdout?.on('data', (d) => shared_1.logger.debug(`[LARAVEL-SERVER] ${d.toString().trim()}`));
        proc.stderr?.on('data', (d) => {
            const msg = d.toString().trim();
            if (msg)
                shared_1.logger.debug(`[LARAVEL-SERVER:ERR] ${msg}`);
        });
        proc.on('error', (err) => shared_1.logger.warn(`Laravel server process error: ${err.message}`));
        const ready = await waitForPort(port, 30000);
        if (ready) {
            shared_1.logger.success(`Laravel server ready at http://localhost:${port}`);
            return { proc };
        }
        else {
            shared_1.logger.warn(`Laravel server did not become ready on port ${port} within 30s. Falling back.`);
            try {
                proc.kill();
            }
            catch { }
        }
    }
    else if (lowerFramework === 'php') {
        shared_1.logger.info(`Spawning \`php -S 127.0.0.1:${port}\` in ${cwd} to serve PHP...`);
        const proc = (await import('child_process')).spawn('php', ['-S', `127.0.0.1:${port}`], {
            cwd,
            shell: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            detached: false,
            env: { ...process.env }
        });
        proc.stdout?.on('data', (d) => shared_1.logger.debug(`[PHP-SERVER] ${d.toString().trim()}`));
        proc.stderr?.on('data', (d) => {
            const msg = d.toString().trim();
            if (msg)
                shared_1.logger.debug(`[PHP-SERVER:ERR] ${msg}`);
        });
        proc.on('error', (err) => shared_1.logger.warn(`PHP server process error: ${err.message}`));
        const ready = await waitForPort(port, 30000);
        if (ready) {
            shared_1.logger.success(`PHP server ready at http://localhost:${port}`);
            return { proc };
        }
        else {
            shared_1.logger.warn(`PHP server did not become ready on port ${port} within 30s. Falling back.`);
            try {
                proc.kill();
            }
            catch { }
        }
    }
    // ── 3. Check if project has a package.json with a dev/start/preview script ──────
    const pkgJsonPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
        let pkg = {};
        try {
            pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
        }
        catch { }
        const scripts = pkg.scripts || {};
        // Determine the best script to run:
        // - SvelteKit with built output → use `preview` (serves compiled SSR output)
        // - Any project with `dev` script → use `dev` (Vite/webpack dev server)
        // - Fallback to `start` script if no `dev` (e.g. Angular, custom Node/React start)
        const hasDev = !!scripts['dev'];
        const hasPreview = !!scripts['preview'];
        const hasStart = !!scripts['start'];
        const hasSvelteKit = fs.existsSync(path.join(cwd, '.svelte-kit'));
        const svelteKitBuilt = hasSvelteKit && fs.existsSync(path.join(cwd, '.svelte-kit', 'output', 'client'));
        const scriptToRun = (hasSvelteKit && svelteKitBuilt && hasPreview)
            ? 'preview'
            : (hasDev ? 'dev' : (hasStart ? 'start' : null));
        if (scriptToRun) {
            const args = ['run', scriptToRun];
            const scriptCmd = scripts[scriptToRun] || '';
            // Override port dynamically for Vite, Angular CLI, and Nuxt
            if (scriptCmd.includes('vite') || scriptCmd.includes('ng serve') || scriptCmd.includes('nuxt')) {
                args.push('--', '--port', String(port));
            }
            shared_1.logger.info(`Spawning \`npm run ${scriptToRun}\`${args.length > 2 ? ' ' + args.slice(2).join(' ') : ''} in ${cwd} to serve the project...`);
            // IMPORTANT: On Windows, .cmd files cannot be spawned directly — must use shell:true
            // so the OS shell resolves 'npm' → 'npm.cmd' automatically. Without this you get EINVAL.
            const proc = (await import('child_process')).spawn('npm', args, {
                cwd,
                shell: true, // ← Required on Windows to resolve npm.cmd
                stdio: ['ignore', 'pipe', 'pipe'],
                detached: false,
                env: { ...process.env, PORT: String(port) } // PORT env var overrides for Next.js, Nuxt, and others
            });
            proc.stdout?.on('data', (d) => shared_1.logger.info(`[DEV-SERVER] ${d.toString().trim()}`));
            proc.stderr?.on('data', (d) => {
                const msg = d.toString().trim();
                if (msg)
                    shared_1.logger.info(`[DEV-SERVER:ERR] ${msg}`);
            });
            proc.on('error', (err) => shared_1.logger.warn(`Dev server process error: ${err.message}`));
            // Wait up to 30s for the dev server to start accepting connections
            const ready = await waitForPort(port, 30000);
            if (ready) {
                shared_1.logger.success(`Dev server ready at http://localhost:${port} (started via npm run ${scriptToRun})`);
                return { proc };
            }
            else {
                shared_1.logger.warn(`Dev server did not become ready on port ${port} within 30s. Falling back to static file server.`);
                try {
                    proc.kill();
                }
                catch { }
            }
        }
    }
    // ── 3. Fallback: Embedded static file server ────────────────────────────
    // For static HTML projects: serve from root, NOT from dist/build,
    // because the actual .html files (about.html, contact.html etc.) live at root.
    // For SPA projects that reach here: serve dist with SPA fallback to index.html.
    const hasDist = fs.existsSync(path.join(cwd, 'dist'));
    const hasBuild = fs.existsSync(path.join(cwd, 'build'));
    const hasPublic = fs.existsSync(path.join(cwd, 'public'));
    const isStaticHtmlProject = framework?.toLowerCase() === 'html';
    // For static HTML: serve from root so all .html pages are accessible
    // For SPA (Vue/Svelte/React): serve dist/ with SPA fallback
    const targetDir = isStaticHtmlProject ? cwd
        : hasDist ? path.join(cwd, 'dist')
            : hasBuild ? path.join(cwd, 'build')
                : hasPublic ? path.join(cwd, 'public')
                    : cwd;
    shared_1.logger.info(`Static file server target directory: ${targetDir} (isStaticHtml=${isStaticHtmlProject})`);
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            let reqPath = req.url ? req.url.split('?')[0] : '/';
            // For static HTML projects: resolve /about → /about.html if that file exists
            if (isStaticHtmlProject && reqPath !== '/' && !path.extname(reqPath)) {
                const htmlVariant = path.join(targetDir, `${reqPath}.html`);
                if (fs.existsSync(htmlVariant)) {
                    reqPath = `${reqPath}.html`;
                }
                else {
                    const dirIndex = path.join(targetDir, reqPath, 'index.html');
                    reqPath = fs.existsSync(dirIndex) ? `${reqPath}/index.html` : reqPath;
                }
            }
            else if (reqPath === '/' || !path.extname(reqPath)) {
                // SPA: try directory index first, then fall through to index.html
                const indexHtml = path.join(targetDir, reqPath === '/' ? 'index.html' : `${reqPath}/index.html`);
                reqPath = fs.existsSync(indexHtml) ? (reqPath === '/' ? 'index.html' : `${reqPath}/index.html`) : 'index.html';
            }
            let filePath = path.join(targetDir, reqPath);
            // SPA fallback: if file not found, serve index.html (client-side routing)
            if (!fs.existsSync(filePath)) {
                const rootIndex = path.join(targetDir, 'index.html');
                if (!isStaticHtmlProject && fs.existsSync(rootIndex)) {
                    filePath = rootIndex;
                }
            }
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end('<h1>404 Not Found</h1>');
                    return;
                }
                const ext = path.extname(filePath).toLowerCase();
                const contentTypes = {
                    '.html': 'text/html; charset=utf-8',
                    '.js': 'application/javascript; charset=utf-8',
                    '.mjs': 'application/javascript; charset=utf-8',
                    '.css': 'text/css; charset=utf-8',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.svg': 'image/svg+xml',
                    '.woff': 'font/woff',
                    '.woff2': 'font/woff2',
                    '.ttf': 'font/ttf'
                };
                res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/html; charset=utf-8' });
                res.end(data);
            });
        });
        server.listen(port, '0.0.0.0', () => {
            shared_1.logger.success(`Automatic embedded web server listening at http://localhost:${port} (serving ${targetDir})`);
            resolve({ server });
        });
        server.on('error', (err) => {
            shared_1.logger.warn(`Failed to bind embedded server to port ${port}: ${err.message}`);
            resolve({});
        });
    });
}
//# sourceMappingURL=index.js.map