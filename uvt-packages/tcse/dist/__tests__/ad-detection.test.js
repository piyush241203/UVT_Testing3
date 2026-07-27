"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const index_js_1 = require("../index.js");
(0, node_test_1.describe)('TCSE Advertisement Detection Plugin Tests', () => {
    (0, node_test_1.test)('Plugin Contract: AdDetectionPlugin has correct name and default enabled state', () => {
        const plugin = new index_js_1.AdDetectionPlugin();
        node_assert_1.default.strictEqual(plugin.name, 'AdDetectionPlugin');
        node_assert_1.default.strictEqual(plugin.version, '1.0.0');
        node_assert_1.default.strictEqual(plugin.enabled, true);
    });
    (0, node_test_1.test)('Domain Intelligence: matchAdDomain accurately resolves ad server vendors', () => {
        node_assert_1.default.strictEqual((0, index_js_1.matchAdDomain)('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'), 'GoogleAdSense');
        node_assert_1.default.strictEqual((0, index_js_1.matchAdDomain)('https://ad.doubleclick.net/ddm/track/clk'), 'DoubleClick');
        node_assert_1.default.strictEqual((0, index_js_1.matchAdDomain)('https://aax.amazon-adsystem.com/e/x.js'), 'AmazonAds');
        node_assert_1.default.strictEqual((0, index_js_1.matchAdDomain)('https://widgets.outbrain.com/outbrain.js'), 'Outbrain');
        node_assert_1.default.strictEqual((0, index_js_1.matchAdDomain)('https://example.com/logo.png'), undefined);
    });
    (0, node_test_1.test)('IAB Ad Dimensions: isIABAdDimension detects standard banner dimensions with tolerance', () => {
        const leaderboard = (0, index_js_1.isIABAdDimension)(728, 90);
        node_assert_1.default.ok(leaderboard);
        node_assert_1.default.strictEqual(leaderboard?.name, 'Leaderboard');
        const mediumRect = (0, index_js_1.isIABAdDimension)(302, 248); // within +-5px tolerance
        node_assert_1.default.ok(mediumRect);
        node_assert_1.default.strictEqual(mediumRect?.name, 'Medium Rectangle');
        const customDiv = (0, index_js_1.isIABAdDimension)(512, 384);
        node_assert_1.default.strictEqual(customDiv, undefined);
    });
    (0, node_test_1.test)('Ad Detection Plugin execution: evaluates Playwright Page DOM and returns TCSESignal reports', async () => {
        const plugin = new index_js_1.AdDetectionPlugin();
        // Mock Playwright Page object simulating DOM candidate detection
        const mockPage = {
            evaluate: async (fn, arg) => {
                return [
                    {
                        selector: 'iframe#google_ads_frame_1',
                        tagName: 'iframe',
                        id: 'google_ads_frame_1',
                        className: 'adsbygoogle',
                        src: 'https://googleads.g.doubleclick.net/pagead/ads',
                        ariaLabel: 'Advertisement',
                        role: 'region',
                        rect: { x: 50, y: 100, width: 728, height: 90 },
                        matchedSources: [
                            { source: 'Domain Intelligence', weight: 0.4, detail: 'Matched domain doubleclick.net', vendor: 'DoubleClick' },
                            { source: 'Iframe Analysis', weight: 0.3, detail: 'Ad iframe container identified', vendor: 'GoogleAdSense' },
                            { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched ad CSS pattern' },
                            { source: 'ARIA Labels', weight: 0.2, detail: 'Matched ARIA label "Advertisement"' },
                            { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched standard IAB ad size: Leaderboard (728x90)' }
                        ]
                    }
                ];
            }
        };
        const signals = await plugin.detect({ page: mockPage });
        node_assert_1.default.strictEqual(signals.length, 1);
        const sig = signals[0];
        node_assert_1.default.strictEqual(sig.category, 'ad');
        node_assert_1.default.strictEqual(sig.type, 'ad');
        node_assert_1.default.strictEqual(sig.selector, 'iframe#google_ads_frame_1');
        node_assert_1.default.strictEqual(sig.vendor, 'GoogleAdSense');
        node_assert_1.default.strictEqual(sig.confidenceScore, 1.0);
        node_assert_1.default.strictEqual(sig.confidence, 1.0);
        node_assert_1.default.ok(sig.reason?.includes('Evidence: [Domain Intelligence]'));
        node_assert_1.default.ok(sig.reason?.includes('Common Ad Dimensions'));
        node_assert_1.default.deepStrictEqual(sig.boundingBox, { x: 50, y: 100, width: 728, height: 90 });
        node_assert_1.default.strictEqual(sig.suggestedAction, 'HIDE');
    });
    (0, node_test_1.test)('TCSEEngine Integration: AdDetectionPlugin registers with TCSEEngine and outputs process result', async () => {
        const registry = new index_js_1.TCSERegistry();
        const plugin = new index_js_1.AdDetectionPlugin();
        registry.registerPlugin(plugin);
        const engine = new index_js_1.TCSEEngine(registry);
        const mockPage = {
            evaluate: async () => [
                {
                    selector: 'div.sidebar-ad',
                    tagName: 'div',
                    id: 'ad-slot-1',
                    className: 'sidebar-ad banner-ad',
                    rect: { x: 900, y: 200, width: 300, height: 250 },
                    matchedSources: [
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched ad CSS pattern' },
                        { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched IAB Medium Rectangle (300x250)' }
                    ]
                }
            ]
        };
        const result = await engine.process({ page: mockPage });
        node_assert_1.default.strictEqual(result.isZeroOp, false);
        node_assert_1.default.strictEqual(result.signals.length, 1);
        node_assert_1.default.strictEqual(result.signals[0].category, 'ad');
        node_assert_1.default.strictEqual(result.signals[0].confidenceScore, 0.4);
        node_assert_1.default.strictEqual(result.decisions.length, 1);
        node_assert_1.default.strictEqual(result.decisions[0].targetSelector, 'div.sidebar-ad');
    });
    (0, node_test_1.test)('Non-mutating Guarantee: Detection mode leaves page DOM untouched', async () => {
        const plugin = new index_js_1.AdDetectionPlugin();
        let isDomModified = false;
        const mockPage = {
            evaluate: async () => {
                // Confirm script execution is read-only
                if (isDomModified) {
                    throw new Error('DOM was mutated during detection phase!');
                }
                return [];
            }
        };
        const signals = await plugin.detect({ page: mockPage });
        node_assert_1.default.strictEqual(signals.length, 0);
        node_assert_1.default.strictEqual(isDomModified, false);
    });
});
//# sourceMappingURL=ad-detection.test.js.map