"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicOrchestrator = void 0;
const pipeline_js_1 = require("../pipeline/pipeline.js");
const index_js_1 = require("../types/index.js");
const event_bus_js_1 = require("../events/event-bus.js");
class DynamicOrchestrator {
    context;
    pipeline;
    constructor(context) {
        this.context = context;
        this.pipeline = new pipeline_js_1.PipelineEngine(context);
        this.setupEventListeners();
    }
    /**
     * Main entry point to stabilize the page and capture snapshot.
     */
    async execute(url, providerName, snapshotOptions = {}, executionMode = index_js_1.ExecutionMode.PARALLEL) {
        const startTime = Date.now();
        this.context.eventBus.emit('PipelineStarted', new event_bus_js_1.PipelineStartedEvent(startTime));
        this.context.logger.info('Starting Dynamic Stabilization Engine pipeline...');
        // 1. Intelligence Gathering
        const signals = await this.pipeline.executeAnalyzers(executionMode);
        this.context.logger.info(`DSE gathered ${signals.length} dynamic signals.`);
        // 1.5 Readiness
        const { VisualReadinessEngine } = await import('../../visual-readiness/index.js');
        const vre = new VisualReadinessEngine();
        const readyResult = await vre.checkReadiness(this.context.page);
        this.context.logger.info(`VRE result: ${readyResult.ready} (${readyResult.reason}) - Duration: ${readyResult.duration}ms`);
        this.context.runtimeMetadata.set('readiness', readyResult);
        // 2. Stabilization
        await this.pipeline.executeStabilizers(signals);
        // 3. Snapshot Execution
        if (providerName) {
            const provider = this.context.registry.getSnapshotProvider(providerName);
            if (provider) {
                await this.runSnapshotSafe(provider, url, snapshotOptions);
            }
            else {
                this.context.logger.warn(`Snapshot provider "${providerName}" not found in registry.`);
            }
        }
        const executionTimeMs = Date.now() - startTime;
        this.context.eventBus.emit('PipelineFinished', new event_bus_js_1.PipelineFinishedEvent(signals.length, executionTimeMs, Date.now()));
        this.context.logger.info(`DSE pipeline completed in ${executionTimeMs}ms.`);
    }
    async runSnapshotSafe(provider, url, options) {
        this.context.eventBus.emit('SnapshotStarted', new event_bus_js_1.SnapshotStartedEvent(url, Date.now()));
        try {
            await provider.initialize(this.context);
            if (!this.context.page) {
                throw new Error('No Playwright Page available in DynamicContext.');
            }
            const captureOptions = { url, ...options };
            await provider.capture(this.context.page, captureOptions);
            this.context.eventBus.emit('SnapshotFinished', new event_bus_js_1.SnapshotFinishedEvent(url, true, Date.now()));
        }
        catch (error) {
            this.context.logger.error(`SnapshotProvider "${provider.name}" failed: ${error.message}`);
            this.context.eventBus.emit('SnapshotFinished', new event_bus_js_1.SnapshotFinishedEvent(url, false, Date.now()));
        }
        finally {
            try {
                await provider.dispose();
            }
            catch (e) { }
        }
    }
    setupEventListeners() {
        // We can hook internal analytics here without tightly coupling modules.
    }
}
exports.DynamicOrchestrator = DynamicOrchestrator;
//# sourceMappingURL=orchestrator.js.map