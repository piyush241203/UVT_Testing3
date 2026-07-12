"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSharedRuntimeTests = runSharedRuntimeTests;
const pipeline_js_1 = require("./pipeline.js");
const execution_context_js_1 = require("../context/execution-context.js");
const registry_js_1 = require("../registry/registry.js");
const event_bus_js_1 = require("../events/event-bus.js");
const errors_js_1 = require("../contracts/errors.js");
async function runSharedRuntimeTests(logger) {
    logger.info('--- Running Shared Runtime Validation Tests ---');
    const registry = new registry_js_1.DSERegistry();
    const eventBus = new event_bus_js_1.EventBus();
    const context = new execution_context_js_1.DynamicContext({
        config: { provider: 'playwright', framework: 'react' },
        logger: logger,
        registry,
        eventBus,
        repositoryRoot: process.cwd(),
        frameworkName: 'react'
    });
    const engine = new pipeline_js_1.PipelineEngine(context);
    // Test 1: Browser Singleton Check
    try {
        context.browserCount = 1;
        await engine.runVerificationPipeline();
        logger.error('[TEST] Browser singleton check failed (allowed duplicate instance).');
    }
    catch (err) {
        if (err instanceof errors_js_1.ValidationError && err.message.includes('browser')) {
            logger.info('[TEST] Browser singleton constraint: PASS');
        }
        else {
            logger.error(`[TEST] Browser singleton check failed with unexpected error: ${err.message}`);
        }
    }
    // Reset context for next test
    const freshContext = new execution_context_js_1.DynamicContext({
        config: { provider: 'playwright', framework: 'react' },
        logger: logger,
        registry,
        eventBus,
        repositoryRoot: process.cwd(),
        frameworkName: 'react'
    });
    const freshEngine = new pipeline_js_1.PipelineEngine(freshContext);
    // Test 2: Shared DOM Graph and Runtime Snapshot existence
    try {
        await freshEngine.runVerificationPipeline();
        if (freshContext.domGraph && freshContext.runtimeSnapshot) {
            logger.info('[TEST] Shared DOM Graph & Runtime Snapshot creation: PASS');
        }
        else {
            throw new Error('DOM Graph or Runtime Snapshot was not generated.');
        }
    }
    catch (err) {
        logger.error(`[TEST] Shared DOM Graph check failed: ${err.message}`);
    }
    // Test 3: Traversal Audit and duplicate tracking
    try {
        freshContext.recordDOMWalk('Framework Intelligence');
        if (freshContext.duplicateDOMWalks === 1) {
            logger.info('[TEST] DOM Traversal Audit tracking: PASS');
        }
        else {
            throw new Error(`Expected 1 duplicate DOM walk, got ${freshContext.duplicateDOMWalks}`);
        }
    }
    catch (err) {
        logger.error(`[TEST] Traversal Audit check failed: ${err.message}`);
    }
    // Test 4: Metadata Reuse checking
    try {
        freshContext.recordMetadataGen('RepositoryMetadata');
        // Generating duplicate time
        freshContext.recordMetadataGen('RepositoryMetadata');
        const count = freshContext.metadataComputations.get('RepositoryMetadata') || 0;
        if (count >= 2) {
            logger.info('[TEST] Metadata Reuse duplication audit: PASS');
        }
        else {
            throw new Error(`Expected at least 2 computations, got ${count}`);
        }
    }
    catch (err) {
        logger.error(`[TEST] Metadata Reuse check failed: ${err.message}`);
    }
}
//# sourceMappingURL=shared-runtime.test.js.map