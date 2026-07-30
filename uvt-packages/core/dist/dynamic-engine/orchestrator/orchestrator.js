"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicOrchestrator = void 0;
const pipeline_js_1 = require("../pipeline/pipeline.js");
const index_js_1 = require("../types/index.js");
const event_bus_js_1 = require("../events/event-bus.js");
const vcl_certifier_js_1 = require("./vcl-certifier.js");
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
        if (!this.context.page) {
            this.context.logger.warn('No active page in orchestrator context. Skipping E2E pipeline.');
            return;
        }
        const page = this.context.page;
        // 1. Intelligence Gathering
        const signals = await this.pipeline.executeAnalyzers(executionMode);
        this.context.logger.info(`DSE gathered ${signals.length} dynamic signals.`);
        // 1.5 Readiness
        const { VisualReadinessEngine } = await import('../../visual-readiness/index.js');
        const vre = new VisualReadinessEngine();
        const readyResult = await vre.checkReadiness(page);
        this.context.logger.info(`VRE result: ${readyResult.ready} (${readyResult.reason}) - Duration: ${readyResult.duration}ms`);
        this.context.runtimeMetadata.set('readiness', readyResult);
        // VCL Phase 1: Capture Original State
        let routeId = '';
        try {
            const route = snapshotOptions.route;
            const routeName = route?.name || snapshotOptions.name || 'Home';
            const routeUrl = route?.url || url;
            const framework = this.context.frameworkName || 'generic';
            routeId = await vcl_certifier_js_1.VCLCertifier.captureOriginalState(page, this.context.repositoryRoot, framework, routeName, routeUrl);
        }
        catch (e) {
            this.context.logger.debug(`[VCL] Capture original state failed: ${e.message}`);
        }
        let tcseResult = { signals: [], decisions: [], durationMs: 0, isZeroOp: true };
        // 1.8 Third-Party Content Stabilization Engine (TCSE)
        try {
            const { TCSEEngine } = await import('@uvt/tcse');
            const tcseEngine = new TCSEEngine();
            tcseResult = await tcseEngine.process({
                page: page,
                config: this.context.config,
                logger: this.context.logger,
                url
            });
            if (tcseResult.isZeroOp) {
                this.context.logger.debug('TCSE result: zero-op pass-through (0 plugins).');
            }
            else {
                this.context.logger.info(`TCSE result: ${tcseResult.signals.length} signals, ${tcseResult.decisions.length} decisions - Duration: ${tcseResult.durationMs}ms`);
                // Execute Visual Execution Engine (VEE) for strategy-driven, framework-safe stabilization & verification
                let veeResult = null;
                try {
                    const { VisualExecutionEngine } = await import('@uvt/vee');
                    const vee = new VisualExecutionEngine({
                        page,
                        framework: this.context.frameworkName || 'generic',
                        logger: this.context.logger
                    });
                    veeResult = await vee.execute(tcseResult.decisions);
                    this.context.runtimeMetadata.set('vee', veeResult);
                }
                catch (veeErr) {
                    this.context.logger.debug(`[VEE] Fallback to legacy TCSE stabilizer: ${veeErr.message}`);
                    await tcseEngine.stabilize({
                        page: page,
                        config: this.context.config,
                        logger: this.context.logger
                    }, tcseResult.decisions);
                }
                // VCL Phase 2: Capture Detection
                if (routeId) {
                    try {
                        await vcl_certifier_js_1.VCLCertifier.captureDetection(this.context.repositoryRoot, routeId, tcseResult);
                    }
                    catch (e) {
                        this.context.logger.debug(`[VCL] Capture detection signals failed: ${e.message}`);
                    }
                }
            }
            this.context.runtimeMetadata.set('tcse', tcseResult);
        }
        catch (err) {
            this.context.logger.debug(`TCSE stage pass-through fallback: ${err.message}`);
        }
        // VCL Phase 3, 4, 5: Capture DOM, Layout Certification, and Visual Comparison
        if (routeId) {
            try {
                await vcl_certifier_js_1.VCLCertifier.captureDomTransformation(page, this.context.repositoryRoot, routeId, tcseResult);
                await vcl_certifier_js_1.VCLCertifier.captureLayoutCertification(page, this.context.repositoryRoot, routeId);
                await vcl_certifier_js_1.VCLCertifier.generateVisualComparison(page, this.context.repositoryRoot, routeId);
            }
            catch (e) {
                this.context.logger.debug(`[VCL] Capture DOM/Layout/Comparison failed: ${e.message}`);
            }
        }
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