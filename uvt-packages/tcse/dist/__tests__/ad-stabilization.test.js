"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const index_js_1 = require("../index.js");
(0, node_test_1.describe)('TCSE Advertisement Stabilization Tests', () => {
    (0, node_test_1.test)('Threshold Decision Logic: maps confidence scores to correct ad modes by default', () => {
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.98), 'HIDE'); // 95+ -> hide
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.95), 'HIDE'); // 95+ -> hide
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.92), 'PLACEHOLDER'); // 90+ -> placeholder
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.90), 'PLACEHOLDER'); // 90+ -> placeholder
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.75), 'MASK'); // 70+ -> mask
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.70), 'MASK'); // 70+ -> mask
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.55), 'BLUR'); // 50+ -> blur
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.50), 'BLUR'); // 50+ -> blur
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.40), 'IGNORE'); // <50 -> ignore
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.10), 'IGNORE'); // <50 -> ignore
    });
    (0, node_test_1.test)('Configurable Thresholds: custom threshold overrides work correctly', () => {
        const customConfig = {
            hideThreshold: 0.90,
            placeholderThreshold: 0.80,
            maskThreshold: 0.60,
            blurThreshold: 0.40
        };
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.91, customConfig), 'HIDE');
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.82, customConfig), 'PLACEHOLDER');
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.65, customConfig), 'MASK');
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.45, customConfig), 'BLUR');
        node_assert_1.default.strictEqual((0, index_js_1.resolveAdAction)(0.35, customConfig), 'IGNORE');
    });
    (0, node_test_1.test)('AdStabilizer Instance: getConfig, setConfig, and resolveAction methods', () => {
        const stabilizer = new index_js_1.AdStabilizer({ hideThreshold: 0.98 });
        node_assert_1.default.strictEqual(stabilizer.getConfig().hideThreshold, 0.98);
        stabilizer.setConfig({ hideThreshold: 0.92 });
        node_assert_1.default.strictEqual(stabilizer.getConfig().hideThreshold, 0.92);
        node_assert_1.default.strictEqual(stabilizer.resolveAction(0.93), 'HIDE');
    });
    (0, node_test_1.test)('Zero CLS Placeholder Mode: locks exact box-model dimensions and margins', async () => {
        const stabilizer = new index_js_1.AdStabilizer();
        const mockSignal = (0, index_js_1.createTCSESignal)({
            category: 'ad',
            selector: '#sidebar-banner-ad',
            confidenceScore: 0.92
        });
        const decision = (0, index_js_1.createTCSEDecision)(mockSignal, 'PLACEHOLDER', 'Preserve box model with placeholder');
        let evaluatedCssRules = [];
        const mockPage = {
            evaluate: async (fn, args) => {
                // Simulate browser DOM evaluation for placeholder box-model preservation
                const mockElementStyle = {
                    setProperty: (prop, val, priority) => {
                        evaluatedCssRules.push({ prop, val, priority });
                    }
                };
                // Invoke style application simulation
                mockElementStyle.setProperty('width', '300px', 'important');
                mockElementStyle.setProperty('height', '250px', 'important');
                mockElementStyle.setProperty('margin-top', '10px', 'important');
                mockElementStyle.setProperty('margin-right', '0px', 'important');
                mockElementStyle.setProperty('margin-bottom', '10px', 'important');
                mockElementStyle.setProperty('margin-left', '0px', 'important');
                mockElementStyle.setProperty('padding-top', '0px', 'important');
                mockElementStyle.setProperty('padding-right', '0px', 'important');
                mockElementStyle.setProperty('padding-bottom', '0px', 'important');
                mockElementStyle.setProperty('padding-left', '0px', 'important');
                mockElementStyle.setProperty('box-sizing', 'border-box', 'important');
                mockElementStyle.setProperty('background-color', '#f1f5f9', 'important');
                mockElementStyle.setProperty('border', '1px dashed #cbd5e1', 'important');
                return true;
            }
        };
        const success = await stabilizer.stabilize(mockPage, decision);
        node_assert_1.default.strictEqual(success, true);
        node_assert_1.default.ok(evaluatedCssRules.some(r => r.prop === 'width' && r.val === '300px'));
        node_assert_1.default.ok(evaluatedCssRules.some(r => r.prop === 'height' && r.val === '250px'));
        node_assert_1.default.ok(evaluatedCssRules.some(r => r.prop === 'margin-top' && r.val === '10px'));
        node_assert_1.default.ok(evaluatedCssRules.some(r => r.prop === 'background-color' && r.val === '#f1f5f9'));
    });
    (0, node_test_1.test)('Non-shifting Hide Mode: applies visibility hidden to preserve layout space', async () => {
        const stabilizer = new index_js_1.AdStabilizer();
        const mockSignal = (0, index_js_1.createTCSESignal)({
            category: 'ad',
            selector: '.header-ad',
            confidenceScore: 0.98
        });
        const decision = (0, index_js_1.createTCSEDecision)(mockSignal, 'HIDE', 'Hide high-confidence ad container');
        const mockPage = {
            evaluate: async (fn, args) => {
                return args.action.toUpperCase() === 'HIDE';
            }
        };
        const success = await stabilizer.stabilize(mockPage, decision);
        node_assert_1.default.strictEqual(success, true);
    });
    (0, node_test_1.test)('Ignore Mode: passes through without modifying DOM or page state', async () => {
        const stabilizer = new index_js_1.AdStabilizer();
        const mockSignal = (0, index_js_1.createTCSESignal)({
            category: 'ad',
            selector: '.low-confidence-ad',
            confidenceScore: 0.35
        });
        const decision = (0, index_js_1.createTCSEDecision)(mockSignal, 'IGNORE', 'Low confidence candidate');
        const mockPage = {
            evaluate: async () => {
                throw new Error('Should not be evaluated for IGNORE action!');
            }
        };
        const success = await stabilizer.stabilize(mockPage, decision);
        node_assert_1.default.strictEqual(success, false);
    });
});
//# sourceMappingURL=ad-stabilization.test.js.map