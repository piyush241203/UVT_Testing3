"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterPopupPlugin = void 0;
const base_plugin_js_1 = require("./base-plugin.js");
class NewsletterPopupPlugin extends base_plugin_js_1.BaseTCSEPlugin {
    name = 'NewsletterPopupPlugin';
    async detect(context) {
        context.logger?.debug?.('NewsletterPopupPlugin: Detector skeleton phase — no active DOM scanning yet.');
        return [];
    }
}
exports.NewsletterPopupPlugin = NewsletterPopupPlugin;
//# sourceMappingURL=newsletter-popup-plugin.js.map