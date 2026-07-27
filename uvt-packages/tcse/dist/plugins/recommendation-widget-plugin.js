"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationWidgetPlugin = void 0;
const base_plugin_js_1 = require("./base-plugin.js");
class RecommendationWidgetPlugin extends base_plugin_js_1.BaseTCSEPlugin {
    name = 'RecommendationWidgetPlugin';
    async detect(context) {
        context.logger?.debug?.('RecommendationWidgetPlugin: Detector skeleton phase — no active DOM scanning yet.');
        return [];
    }
}
exports.RecommendationWidgetPlugin = RecommendationWidgetPlugin;
//# sourceMappingURL=recommendation-widget-plugin.js.map