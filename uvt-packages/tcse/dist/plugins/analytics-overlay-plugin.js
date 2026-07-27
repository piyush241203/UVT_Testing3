"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsOverlayPlugin = void 0;
const base_plugin_js_1 = require("./base-plugin.js");
class AnalyticsOverlayPlugin extends base_plugin_js_1.BaseTCSEPlugin {
    name = 'AnalyticsOverlayPlugin';
    async detect(context) {
        context.logger?.debug?.('AnalyticsOverlayPlugin: Detector skeleton phase — no active DOM scanning yet.');
        return [];
    }
}
exports.AnalyticsOverlayPlugin = AnalyticsOverlayPlugin;
//# sourceMappingURL=analytics-overlay-plugin.js.map