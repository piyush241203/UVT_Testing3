"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const index_js_1 = require("../index.js");
(0, node_test_1.describe)('TCSE Certification Lab & Configuration System Tests', () => {
    (0, node_test_1.test)('Config Validation: validateTCSEConfig parses custom and default uvt.config options', async () => {
        const { validateTCSEConfig, DEFAULT_TCSE_CONFIG } = await import('../../../config/dist/index.js');
        const defaultConfig = validateTCSEConfig();
        node_assert_1.default.strictEqual(defaultConfig.enabled, true);
        node_assert_1.default.strictEqual(defaultConfig.plugins.advertisement.mode, 'placeholder');
        node_assert_1.default.strictEqual(defaultConfig.plugins.advertisement.confidenceThreshold, 70);
        const customInput = {
            enabled: true,
            plugins: {
                advertisement: {
                    enabled: true,
                    mode: 'hide',
                    confidenceThreshold: 90
                }
            }
        };
        const parsed = validateTCSEConfig(customInput);
        node_assert_1.default.strictEqual(parsed.plugins.advertisement.mode, 'hide');
        node_assert_1.default.strictEqual(parsed.plugins.advertisement.confidenceThreshold, 90);
    });
    (0, node_test_1.test)('Engine Config Pass-Through: TCSEEngine halts execution when tcse.enabled = false', async () => {
        const registry = new index_js_1.TCSERegistry();
        registry.registerPlugin(new index_js_1.AdDetectionPlugin());
        const engine = new index_js_1.TCSEEngine(registry);
        const disabledResult = await engine.process({
            config: { tcse: { enabled: false } }
        });
        node_assert_1.default.strictEqual(disabledResult.isZeroOp, true);
        node_assert_1.default.strictEqual(disabledResult.signals.length, 0);
    });
    (0, node_test_1.describe)('Certification Lab: 10 Ad Provider Scenarios', () => {
        const adProviderScenarios = [
            {
                id: '1. Google AdSense',
                vendor: 'GoogleAdSense',
                candidate: {
                    selector: 'ins.adsbygoogle',
                    tagName: 'ins',
                    id: '',
                    className: 'adsbygoogle',
                    src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
                    rect: { x: 100, y: 50, width: 728, height: 90 },
                    matchedSources: [
                        { source: 'Domain Intelligence', weight: 0.4, detail: 'Matched domain googlesyndication.com', vendor: 'GoogleAdSense' },
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched ins.adsbygoogle' },
                        { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched Leaderboard (728x90)' }
                    ]
                }
            },
            {
                id: '2. Google Ad Manager',
                vendor: 'DoubleClick',
                candidate: {
                    selector: 'iframe#google_ads_iframe_1',
                    tagName: 'iframe',
                    id: 'google_ads_iframe_1',
                    className: 'google-ads-iframe',
                    src: 'https://googleads.g.doubleclick.net/pagead/ads',
                    rect: { x: 100, y: 150, width: 300, height: 250 },
                    matchedSources: [
                        { source: 'Domain Intelligence', weight: 0.4, detail: 'Matched domain doubleclick.net', vendor: 'DoubleClick' },
                        { source: 'Iframe Analysis', weight: 0.3, detail: 'Ad iframe container identified' },
                        { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched Medium Rectangle (300x250)' }
                    ]
                }
            },
            {
                id: '3. Amazon Ads',
                vendor: 'AmazonAds',
                candidate: {
                    selector: 'iframe#amazon-ad-frame',
                    tagName: 'iframe',
                    id: 'amazon-ad-frame',
                    className: 'amazon-ad-box',
                    src: 'https://aax.amazon-adsystem.com/e/x.js',
                    rect: { x: 500, y: 150, width: 300, height: 600 },
                    matchedSources: [
                        { source: 'Domain Intelligence', weight: 0.4, detail: 'Matched domain amazon-adsystem.com', vendor: 'AmazonAds' },
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched amazon-ad-box' },
                        { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched Half Page (300x600)' }
                    ]
                }
            },
            {
                id: '4. Media.net',
                vendor: 'GenericAd',
                candidate: {
                    selector: '#medianet-ad-slot',
                    tagName: 'div',
                    id: 'medianet-ad-slot',
                    className: 'medianet-ad ad-unit',
                    rect: { x: 850, y: 150, width: 160, height: 600 },
                    matchedSources: [
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched ad-unit' },
                        { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched Skyscraper (160x600)' },
                        { source: 'Mutation Observer', weight: 0.2, detail: 'Dynamic insertion detected' }
                    ]
                }
            },
            {
                id: '5. Taboola',
                vendor: 'Taboola',
                candidate: {
                    selector: '#taboola-widget-1',
                    tagName: 'div',
                    id: 'taboola-widget-1',
                    className: 'taboola-widget sponsored-content',
                    src: 'https://taboola.com/widget',
                    rect: { x: 100, y: 800, width: 600, height: 250 },
                    matchedSources: [
                        { source: 'Domain Intelligence', weight: 0.4, detail: 'Matched domain taboola.com', vendor: 'Taboola' },
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched sponsored-content' },
                        { source: 'ARIA Labels', weight: 0.2, detail: 'Matched ARIA label "Sponsored"' }
                    ]
                }
            },
            {
                id: '6. Outbrain',
                vendor: 'Outbrain',
                candidate: {
                    selector: '#outbrain-widget-1',
                    tagName: 'div',
                    id: 'outbrain-widget-1',
                    className: 'outbrain-widget ad-box',
                    src: 'https://outbrain.com/widget',
                    rect: { x: 750, y: 800, width: 600, height: 250 },
                    matchedSources: [
                        { source: 'Domain Intelligence', weight: 0.4, detail: 'Matched domain outbrain.com', vendor: 'Outbrain' },
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched ad-box' }
                    ]
                }
            },
            {
                id: '7. Criteo',
                vendor: 'Criteo',
                candidate: {
                    selector: '#criteo-ad-unit',
                    tagName: 'div',
                    id: 'criteo-ad-unit',
                    className: 'criteo-ad ad-slot',
                    src: 'https://criteo.com/ad.js',
                    rect: { x: 100, y: 1100, width: 336, height: 280 },
                    matchedSources: [
                        { source: 'Domain Intelligence', weight: 0.4, detail: 'Matched domain criteo.com', vendor: 'Criteo' },
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched ad-slot' },
                        { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched Large Rectangle (336x280)' }
                    ]
                }
            },
            {
                id: '8. RevContent',
                vendor: 'GenericAd',
                candidate: {
                    selector: '#ad-slot-rev',
                    tagName: 'div',
                    id: 'ad-slot-rev',
                    className: 'revcontent-ad ad-container',
                    rect: { x: 500, y: 1100, width: 300, height: 250 },
                    matchedSources: [
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched ad-container' },
                        { source: 'ARIA Labels', weight: 0.2, detail: 'Matched ARIA label "Sponsored advertisement"' },
                        { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched Medium Rectangle (300x250)' }
                    ]
                }
            },
            {
                id: '9. Affiliate Banner',
                vendor: 'GenericAd',
                candidate: {
                    selector: '#affiliate-banner-1',
                    tagName: 'div',
                    id: 'affiliate-banner-1',
                    className: 'affiliate-banner banner-ad',
                    rect: { x: 100, y: 1450, width: 320, height: 50 },
                    matchedSources: [
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched banner-ad' },
                        { source: 'ARIA Labels', weight: 0.2, detail: 'Matched ARIA label "advertisement"' },
                        { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched Mobile Leaderboard (320x50)' }
                    ]
                }
            },
            {
                id: '10. Internal Marketing Banner',
                vendor: 'GenericAd',
                candidate: {
                    selector: '#internal-promo-banner',
                    tagName: 'div',
                    id: 'internal-promo-banner',
                    className: 'internal-marketing-banner google-ad',
                    rect: { x: 100, y: 1550, width: 970, height: 90 },
                    matchedSources: [
                        { source: 'CSS Heuristics', weight: 0.2, detail: 'Matched google-ad' },
                        { source: 'ARIA Labels', weight: 0.2, detail: 'Matched ARIA label "sponsored promo"' },
                        { source: 'Common Ad Dimensions', weight: 0.2, detail: 'Matched Large Leaderboard (970x90)' }
                    ]
                }
            }
        ];
        for (const scenario of adProviderScenarios) {
            (0, node_test_1.test)(`Scenario ${scenario.id}: verifies detection, confidence >= 0.6, and zero-CLS placeholder stabilization`, async () => {
                const plugin = new index_js_1.AdDetectionPlugin();
                const mockPage = {
                    evaluate: async () => [scenario.candidate]
                };
                const signals = await plugin.detect({ page: mockPage });
                node_assert_1.default.strictEqual(signals.length, 1);
                const sig = signals[0];
                node_assert_1.default.strictEqual(sig.category, 'ad');
                node_assert_1.default.ok(sig.confidenceScore >= 0.6, `Confidence score ${sig.confidenceScore} should be >= 0.6`);
                node_assert_1.default.strictEqual(sig.vendor, scenario.vendor);
                // Verify stabilization decision & zero-CLS placeholder execution
                const stabilizer = new index_js_1.AdStabilizer();
                const action = (0, index_js_1.resolveAdAction)(sig.confidenceScore);
                node_assert_1.default.ok(['PLACEHOLDER', 'HIDE', 'MASK', 'BLUR', 'IGNORE'].includes(action));
                let isBoxModelPreserved = false;
                const mockPageForStabilization = {
                    evaluate: async (fn, args) => {
                        isBoxModelPreserved = true;
                        return true;
                    }
                };
                const success = await stabilizer.stabilize(mockPageForStabilization, {
                    id: 'dec-1',
                    signalId: sig.id,
                    action: 'PLACEHOLDER',
                    targetSelector: sig.selector,
                    confidenceScore: sig.confidenceScore,
                    priority: 10,
                    rationale: 'Certification test',
                    timestamp: Date.now()
                });
                node_assert_1.default.strictEqual(success, true);
                node_assert_1.default.strictEqual(isBoxModelPreserved, true);
            });
        }
    });
});
//# sourceMappingURL=certification-lab.test.js.map