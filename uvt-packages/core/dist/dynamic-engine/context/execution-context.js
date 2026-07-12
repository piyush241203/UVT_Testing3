"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicContext = void 0;
const store_js_1 = require("../models/signal/store.js");
const graph_js_1 = require("../graph/graph.js");
/**
 * Shared Execution Context passed to all Analyzers and Stabilizers.
 */
class DynamicContext {
    config;
    logger;
    page;
    browser;
    registry;
    eventBus;
    signalStore;
    signalGraph;
    frameworkMetadata;
    repositoryMetadata;
    astMetadata;
    networkMetadata;
    runtimeDomMetadata;
    mutationMetadata;
    executionMetadata;
    // Shared Runtime Data
    runtimeSnapshot;
    domGraph;
    mutationStream;
    duplicateDOMWalks = 0;
    browserCount = 0;
    metadataComputations = new Map();
    // Runtime Metadata for arbitrary sharing 
    runtimeMetadata = new Map();
    tracer;
    recordDOMWalk(engineName) {
        if (this.domGraph) {
            this.duplicateDOMWalks++;
            this.logger.warn(`[AUDIT] Engine "${engineName}" performed a DOM traversal after DOM Graph was built.`);
        }
    }
    recordMetadataGen(metadataName) {
        const count = this.metadataComputations.get(metadataName) || 0;
        if (count > 0) {
            this.logger.warn(`[AUDIT] Metadata "${metadataName}" generated duplicate times.`);
        }
        this.metadataComputations.set(metadataName, count + 1);
    }
    constructor(options) {
        this.config = options.config;
        this.logger = options.logger;
        this.page = options.page;
        this.browser = options.browser;
        this.registry = options.registry;
        this.eventBus = options.eventBus;
        this.frameworkMetadata = options.frameworkMetadata;
        this.repositoryMetadata = options.repositoryMetadata;
        this.astMetadata = options.astMetadata;
        this.networkMetadata = options.networkMetadata;
        this.runtimeDomMetadata = options.runtimeDomMetadata;
        this.mutationMetadata = options.mutationMetadata;
        this.signalStore = new store_js_1.DefaultSignalStore();
        this.signalGraph = new graph_js_1.DefaultSignalGraph();
    }
    setMetadata(key, value) {
        this.runtimeMetadata.set(key, value);
    }
    getMetadata(key) {
        return this.runtimeMetadata.get(key);
    }
}
exports.DynamicContext = DynamicContext;
//# sourceMappingURL=execution-context.js.map