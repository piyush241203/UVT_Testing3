"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPipelineTests = runPipelineTests;
const pipeline_js_1 = require("./pipeline.js");
const execution_context_js_1 = require("../context/execution-context.js");
const registry_js_1 = require("../registry/registry.js");
const event_bus_js_1 = require("../events/event-bus.js");
const errors_js_1 = require("../contracts/errors.js");
async function runPipelineTests(logger) {
    logger.info('--- Running Pipeline E2E Verification Tests ---');
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
    // Test 1: Stage Registration and Verification
    try {
        const order = engine.verifyPipelineStructure();
        if (order.length !== 16) {
            throw new Error(`Expected 16 registered stages, got ${order.length}`);
        }
        logger.info('[TEST] Stage registration and length: PASS');
    }
    catch (err) {
        logger.error(`[TEST] Stage registration failed: ${err.message}`);
    }
    // Test 2: Dependency cycle detection
    try {
        const invalidEngine = new pipeline_js_1.PipelineEngine(context);
        invalidEngine.registerStage({
            id: 'cycle-a',
            name: 'Cycle A',
            version: '1.0.0',
            priority: 1,
            dependsOn: ['cycle-b'],
            execute: async () => { }
        });
        invalidEngine.registerStage({
            id: 'cycle-b',
            name: 'Cycle B',
            version: '1.0.0',
            priority: 2,
            dependsOn: ['cycle-a'],
            execute: async () => { }
        });
        invalidEngine.verifyPipelineStructure();
        logger.error('[TEST] Dependency cycle detection failed (cycle was not detected).');
    }
    catch (err) {
        if (err instanceof errors_js_1.ValidationError && err.message.includes('cycle')) {
            logger.info('[TEST] Dependency cycle detection: PASS');
        }
        else {
            logger.error(`[TEST] Dependency cycle detection failed with unexpected error: ${err.message}`);
        }
    }
    // Test 3: Shared Context identity validation
    try {
        await engine.runVerificationPipeline();
        logger.info('[TEST] E2E pipeline run with Context Identity validation: PASS');
    }
    catch (err) {
        logger.error(`[TEST] Pipeline E2E execution run failed: ${err.message}`);
    }
}
//# sourceMappingURL=pipeline.test.js.map