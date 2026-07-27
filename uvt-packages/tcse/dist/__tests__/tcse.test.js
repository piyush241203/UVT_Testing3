"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const index_js_1 = require("../index.js");
(0, node_test_1.describe)('TCSE Foundation Architectural Tests', () => {
    (0, node_test_1.test)('Zero-op Execution: when no plugins registered, returns isZeroOp = true and empty arrays', async () => {
        const registry = new index_js_1.TCSERegistry();
        const engine = new index_js_1.TCSEEngine(registry);
        const result = await engine.process();
        node_assert_1.default.strictEqual(result.isZeroOp, true);
        node_assert_1.default.strictEqual(result.signals.length, 0);
        node_assert_1.default.strictEqual(result.decisions.length, 0);
        node_assert_1.default.ok(result.durationMs >= 0);
    });
    (0, node_test_1.test)('TCSERegistry: plugin registration, lookup, and unregistration', () => {
        const registry = new index_js_1.TCSERegistry();
        const dummyPlugin = {
            name: 'TestAdDetector',
            version: '1.0.0',
            enabled: true,
            detect: async () => []
        };
        registry.registerPlugin(dummyPlugin);
        node_assert_1.default.strictEqual(registry.count(), 1);
        node_assert_1.default.strictEqual(registry.getPlugin('TestAdDetector')?.name, 'TestAdDetector');
        const unreg = registry.unregisterPlugin('TestAdDetector');
        node_assert_1.default.strictEqual(unreg, true);
        node_assert_1.default.strictEqual(registry.count(), 0);
    });
    (0, node_test_1.test)('Signal Models: createTCSESignal creates normalized signal object', () => {
        const signal = (0, index_js_1.createTCSESignal)({
            category: 'ad',
            selector: '.google-ad-container',
            vendor: 'GoogleAdSense',
            confidenceScore: 0.95,
            boundingBox: { x: 10, y: 20, width: 300, height: 250 }
        });
        node_assert_1.default.ok(signal.id.startsWith('tcse-sig-'));
        node_assert_1.default.strictEqual(signal.category, 'ad');
        node_assert_1.default.strictEqual(signal.selector, '.google-ad-container');
        node_assert_1.default.strictEqual(signal.vendor, 'GoogleAdSense');
        node_assert_1.default.strictEqual(signal.confidenceScore, 0.95);
        node_assert_1.default.deepStrictEqual(signal.boundingBox, { x: 10, y: 20, width: 300, height: 250 });
    });
    (0, node_test_1.test)('Confidence Scoring: DefaultConfidenceModel evaluates risk levels', () => {
        const model = new index_js_1.DefaultConfidenceModel();
        const highRisk = model.evaluate({ confidenceScore: 0.9, vendor: 'OneTrust', category: 'cookie_banner' });
        node_assert_1.default.strictEqual(highRisk.riskLevel, 'HIGH');
        node_assert_1.default.strictEqual(highRisk.vendorMatchStrength, 0.9);
        const lowRisk = model.evaluate({ confidenceScore: 0.2, category: 'unknown' });
        node_assert_1.default.strictEqual(lowRisk.riskLevel, 'LOW');
    });
    (0, node_test_1.test)('Decision Models: createTCSEDecision maps signals to action types', () => {
        const signal = (0, index_js_1.createTCSESignal)({
            category: 'cookie_banner',
            selector: '#onetrust-consent-sdk',
            vendor: 'OneTrust',
            confidenceScore: 0.99
        });
        const decision = (0, index_js_1.createTCSEDecision)(signal, 'HIDE', 'Hide cookie consent modal before snapshot');
        node_assert_1.default.ok(decision.id.startsWith('tcse-dec-'));
        node_assert_1.default.strictEqual(decision.signalId, signal.id);
        node_assert_1.default.strictEqual(decision.action, 'HIDE');
        node_assert_1.default.strictEqual(decision.targetSelector, '#onetrust-consent-sdk');
        node_assert_1.default.strictEqual(decision.confidenceScore, 0.99);
    });
    (0, node_test_1.test)('Plugin Execution Flow: registered plugin produces signals and decisions', async () => {
        const registry = new index_js_1.TCSERegistry();
        const engine = new index_js_1.TCSEEngine(registry);
        const mockAdPlugin = {
            name: 'MockAdPlugin',
            version: '1.0.0',
            enabled: true,
            detect: async () => [
                (0, index_js_1.createTCSESignal)({
                    category: 'ad',
                    selector: 'iframe[src*="doubleclick.net"]',
                    vendor: 'GoogleAdSense',
                    confidenceScore: 0.88
                })
            ],
            evaluate: async (signals) => [
                (0, index_js_1.createTCSEDecision)(signals[0], 'REMOVE', 'Remove ad frame to avoid visual diff')
            ]
        };
        registry.registerPlugin(mockAdPlugin);
        const result = await engine.process();
        node_assert_1.default.strictEqual(result.isZeroOp, false);
        node_assert_1.default.strictEqual(result.signals.length, 1);
        node_assert_1.default.strictEqual(result.decisions.length, 1);
        node_assert_1.default.strictEqual(result.decisions[0].action, 'REMOVE');
        node_assert_1.default.strictEqual(result.decisions[0].targetSelector, 'iframe[src*="doubleclick.net"]');
    });
});
//# sourceMappingURL=tcse.test.js.map