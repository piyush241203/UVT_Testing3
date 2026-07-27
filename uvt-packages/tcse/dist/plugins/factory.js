"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCSEPluginFactory = void 0;
const registry_js_1 = require("../registry/registry.js");
const ad_detection_plugin_js_1 = require("./ad-detection-plugin.js");
const cookie_banner_plugin_js_1 = require("./cookie-banner-plugin.js");
const chat_widget_plugin_js_1 = require("./chat-widget-plugin.js");
const newsletter_popup_plugin_js_1 = require("./newsletter-popup-plugin.js");
const survey_popup_plugin_js_1 = require("./survey-popup-plugin.js");
const consent_manager_plugin_js_1 = require("./consent-manager-plugin.js");
const recommendation_widget_plugin_js_1 = require("./recommendation-widget-plugin.js");
const social_embed_plugin_js_1 = require("./social-embed-plugin.js");
const analytics_overlay_plugin_js_1 = require("./analytics-overlay-plugin.js");
class TCSEPluginFactory {
    static createPluginSuite() {
        return [
            new ad_detection_plugin_js_1.AdDetectionPlugin(),
            new cookie_banner_plugin_js_1.CookieBannerPlugin(),
            new chat_widget_plugin_js_1.ChatWidgetPlugin(),
            new newsletter_popup_plugin_js_1.NewsletterPopupPlugin(),
            new survey_popup_plugin_js_1.SurveyPopupPlugin(),
            new consent_manager_plugin_js_1.ConsentManagerPlugin(),
            new recommendation_widget_plugin_js_1.RecommendationWidgetPlugin(),
            new social_embed_plugin_js_1.SocialEmbedPlugin(),
            new analytics_overlay_plugin_js_1.AnalyticsOverlayPlugin()
        ];
    }
    static registerDefaultSuite(registry = registry_js_1.defaultTCSERegistry) {
        const suite = this.createPluginSuite();
        for (const plugin of suite) {
            registry.registerPlugin(plugin);
        }
    }
}
exports.TCSEPluginFactory = TCSEPluginFactory;
//# sourceMappingURL=factory.js.map