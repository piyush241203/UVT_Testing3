"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const index_js_1 = require("../index.js");
(0, node_test_1.describe)('TCSE AI Classification System Tests', () => {
    (0, node_test_1.test)('Strict Rule Enforcement: AI returns 0 boost and non-actionable result when heuristic confidence is 0', () => {
        const classifier = new index_js_1.AITCSEClassifier();
        const metadata = {
            tagName: 'div',
            className: 'random-ad-box',
            ariaLabel: 'advertisement'
        };
        const result = classifier.classify(metadata, 0);
        node_assert_1.default.strictEqual(result.confidenceBoost, 0);
        node_assert_1.default.strictEqual(result.isActionable, false);
        node_assert_1.default.ok(result.rationale.includes('AI classifier rejected'));
        node_assert_1.default.ok(result.rationale.includes('zero heuristic evidence'));
        // Verify AI alone CANNOT trigger HIDE or PLACEHOLDER
        const action = (0, index_js_1.resolveAdAction)(0 + result.confidenceBoost);
        node_assert_1.default.strictEqual(action, 'IGNORE');
    });
    (0, node_test_1.test)('Secondary Input Boost: AI provides capped secondary boost (+0.15 max) when heuristic evidence > 0', () => {
        const classifier = new index_js_1.AITCSEClassifier();
        const metadata = {
            tagName: 'div',
            className: 'sponsored-content banner-ad',
            ariaLabel: 'advertisement'
        };
        const heuristicScore = 0.80;
        const result = classifier.classify(metadata, heuristicScore);
        node_assert_1.default.ok(result.confidenceBoost > 0);
        node_assert_1.default.ok(result.confidenceBoost <= 0.15, `Boost ${result.confidenceBoost} must not exceed max cap 0.15`);
        node_assert_1.default.strictEqual(result.isActionable, true);
        // Combined score = 0.80 + 0.14 = 0.94 -> PLACEHOLDER mode
        const combinedScore = heuristicScore + result.confidenceBoost;
        const action = (0, index_js_1.resolveAdAction)(combinedScore);
        node_assert_1.default.strictEqual(action, 'PLACEHOLDER');
    });
    (0, node_test_1.test)('AI Safety Limit: High AI confidence alone (1.0) with zero heuristic score produces IGNORE action', () => {
        const classifier = new index_js_1.AITCSEClassifier();
        const metadata = {
            tagName: 'iframe',
            src: 'https://unknown-domain.com/ad.html',
            className: 'ad-unit'
        };
        // Heuristic score is 0.0
        const result = classifier.classify(metadata, 0.0);
        const finalScore = 0.0 + result.confidenceBoost;
        const finalAction = (0, index_js_1.resolveAdAction)(finalScore);
        node_assert_1.default.strictEqual(finalScore, 0.0);
        node_assert_1.default.strictEqual(finalAction, 'IGNORE');
    });
    (0, node_test_1.test)('AI Secondary Boost Promotion: Upgrades candidate from 0.77 (MASK) to 0.90+ (PLACEHOLDER) when primary evidence exists', () => {
        const classifier = new index_js_1.AITCSEClassifier();
        const metadata = {
            className: 'google-ad banner-ad',
            ariaLabel: 'advertisement'
        };
        const primaryHeuristicScore = 0.77;
        const initialAction = (0, index_js_1.resolveAdAction)(primaryHeuristicScore);
        node_assert_1.default.strictEqual(initialAction, 'MASK');
        const result = classifier.classify(metadata, primaryHeuristicScore);
        const upgradedScore = primaryHeuristicScore + result.confidenceBoost;
        const upgradedAction = (0, index_js_1.resolveAdAction)(upgradedScore);
        node_assert_1.default.strictEqual(upgradedScore >= 0.90, true);
        node_assert_1.default.strictEqual(upgradedAction, 'PLACEHOLDER');
    });
});
//# sourceMappingURL=ai-classification.test.js.map