"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapabilityGraphBuilder = void 0;
exports.createRepoContext = createRepoContext;
exports.buildCapabilityGraph = buildCapabilityGraph;
exports.resolveFramework = resolveFramework;
exports.resolveFrameworkAsync = resolveFrameworkAsync;
const shared_1 = require("@uvt/shared");
const index_js_1 = require("../repository-intelligence/index.js");
const capability_graph_js_1 = require("../capability-graph/capability-graph.js");
Object.defineProperty(exports, "CapabilityGraphBuilder", { enumerable: true, get: function () { return capability_graph_js_1.CapabilityGraphBuilder; } });
async function createRepoContext(cwd) {
    const rieContext = await index_js_1.DependencyParser.createContext(cwd);
    return {
        cwd: rieContext.cwd,
        packageJson: rieContext.packageJson,
        dependencies: rieContext.dependencies,
        files: rieContext.files
    };
}
/**
 * Build a fully typed CapabilityGraph from an RIE scan.
 * This is the primary entry point for the URAE Generator Planner and
 * Artifact Validation Engine.
 */
async function buildCapabilityGraph(cwd) {
    const engine = new index_js_1.RepositoryIntelligenceEngine(cwd);
    const scan = await engine.scan(cwd, true);
    return capability_graph_js_1.CapabilityGraphBuilder.build(scan, cwd);
}
function resolveFramework(repo, plugins) {
    // Sync wrapper remains for older API calls.
    return plugins[0]; // fallback
}
async function resolveFrameworkAsync(repo, plugins) {
    // First, check RIE
    const engine = new index_js_1.RepositoryIntelligenceEngine(repo.cwd);
    const rie = await engine.scan(repo.cwd);
    const detectedFrameworkName = rie.metadata.framework;
    let bestPlugin = null;
    let highestConfidence = 0;
    let bestEvidence = [];
    // Match RIE framework to our available plugins
    for (const plugin of plugins) {
        if (plugin.apiVersion !== 1)
            continue;
        // If the plugin name vaguely matches the RIE framework, prioritize it!
        if ((detectedFrameworkName !== 'Static HTML' || plugin.name === 'html') &&
            (plugin.name.toLowerCase().includes(detectedFrameworkName.toLowerCase()) ||
                detectedFrameworkName.toLowerCase().includes(plugin.name.toLowerCase().replace('framework-', '')))) {
            bestPlugin = plugin;
            highestConfidence = 100;
            bestEvidence = [`Mapped RIE framework "${detectedFrameworkName}" directly to plugin "${plugin.name}"`];
            break;
        }
        // Otherwise fallback to their internal detect
        try {
            const res = await plugin.detect(repo);
            if (res && res.confidence > highestConfidence) {
                highestConfidence = res.confidence;
                bestPlugin = plugin;
                bestEvidence = res.evidence;
            }
        }
        catch (e) {
            shared_1.logger.debug(`Error running detect on plugin ${plugin.name}: ${e.message}`);
        }
    }
    if (!bestPlugin) {
        // Return generic default fallback
        const genericPlugin = {
            name: 'generic',
            apiVersion: 1,
            detect: async () => ({ confidence: 0.1, evidence: ['No specific framework detected.'] }),
            discoverRoutes: async () => [{ name: 'Home', url: '/' }]
        };
        return {
            plugin: genericPlugin,
            confidence: 0.1,
            evidence: ['Using default fallback plugin.']
        };
    }
    return {
        plugin: bestPlugin,
        confidence: highestConfidence,
        evidence: bestEvidence
    };
}
//# sourceMappingURL=repository-analyzer.js.map