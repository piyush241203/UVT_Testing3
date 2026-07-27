"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const index_js_1 = require("../index.js");
(0, node_test_1.describe)('TCSE Multi-Plugin Framework & Future Plugin Skeletons Tests', () => {
    (0, node_test_1.test)('Plugin Contract & Inheritance: All 8 future plugin skeletons extend BaseTCSEPlugin', () => {
        const plugins = [
            new index_js_1.CookieBannerPlugin(),
            new index_js_1.ChatWidgetPlugin(),
            new index_js_1.NewsletterPopupPlugin(),
            new index_js_1.SurveyPopupPlugin(),
            new index_js_1.ConsentManagerPlugin(),
            new index_js_1.RecommendationWidgetPlugin(),
            new index_js_1.SocialEmbedPlugin(),
            new index_js_1.AnalyticsOverlayPlugin()
        ];
        for (const plugin of plugins) {
            node_assert_1.default.ok(plugin instanceof index_js_1.BaseTCSEPlugin);
            node_assert_1.default.strictEqual(plugin.version, '1.0.0');
            node_assert_1.default.strictEqual(plugin.enabled, true);
            node_assert_1.default.ok(typeof plugin.name === 'string' && plugin.name.length > 0);
        }
    });
    (0, node_test_1.test)('TCSERegistry Multi-Plugin Registration: Registers and queries all 9 built-in plugins', () => {
        const registry = new index_js_1.TCSERegistry();
        index_js_1.TCSEPluginFactory.registerDefaultSuite(registry);
        const allPlugins = registry.getAllPlugins();
        node_assert_1.default.strictEqual(allPlugins.length, 9);
        node_assert_1.default.ok(registry.getPlugin('AdDetectionPlugin'));
        node_assert_1.default.ok(registry.getPlugin('CookieBannerPlugin'));
        node_assert_1.default.ok(registry.getPlugin('ChatWidgetPlugin'));
        node_assert_1.default.ok(registry.getPlugin('NewsletterPopupPlugin'));
        node_assert_1.default.ok(registry.getPlugin('SurveyPopupPlugin'));
        node_assert_1.default.ok(registry.getPlugin('ConsentManagerPlugin'));
        node_assert_1.default.ok(registry.getPlugin('RecommendationWidgetPlugin'));
        node_assert_1.default.ok(registry.getPlugin('SocialEmbedPlugin'));
        node_assert_1.default.ok(registry.getPlugin('AnalyticsOverlayPlugin'));
    });
    (0, node_test_1.test)('TCSEEngine Execution with Multi-Plugin Suite: Engine processes all 9 plugins cleanly', async () => {
        const registry = new index_js_1.TCSERegistry();
        index_js_1.TCSEPluginFactory.registerDefaultSuite(registry);
        const engine = new index_js_1.TCSEEngine(registry);
        const mockPage = {
            evaluate: async () => []
        };
        const result = await engine.process({ page: mockPage });
        node_assert_1.default.strictEqual(result.isZeroOp, false);
        node_assert_1.default.strictEqual(result.signals.length, 0);
        node_assert_1.default.strictEqual(result.decisions.length, 0);
        node_assert_1.default.ok(result.durationMs >= 0);
    });
    (0, node_test_1.test)('Extensible Skeleton Execution: Future skeletons return empty signal arrays until detectors are enabled', async () => {
        const context = { logger: { debug: () => { } } };
        const cookiePlugin = new index_js_1.CookieBannerPlugin();
        const chatPlugin = new index_js_1.ChatWidgetPlugin();
        const popupPlugin = new index_js_1.NewsletterPopupPlugin();
        const cookieSignals = await cookiePlugin.detect(context);
        const chatSignals = await chatPlugin.detect(context);
        const popupSignals = await popupPlugin.detect(context);
        node_assert_1.default.deepStrictEqual(cookieSignals, []);
        node_assert_1.default.deepStrictEqual(chatSignals, []);
        node_assert_1.default.deepStrictEqual(popupSignals, []);
    });
});
//# sourceMappingURL=future-plugins.test.js.map