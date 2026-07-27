"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieBannerPlugin = void 0;
const base_plugin_js_1 = require("./base-plugin.js");
class CookieBannerPlugin extends base_plugin_js_1.BaseTCSEPlugin {
    name = 'CookieBannerPlugin';
    async detect(context) {
        context.logger?.debug?.('CookieBannerPlugin: Detector skeleton phase — no active DOM scanning yet.');
        return [];
    }
}
exports.CookieBannerPlugin = CookieBannerPlugin;
//# sourceMappingURL=cookie-banner-plugin.js.map