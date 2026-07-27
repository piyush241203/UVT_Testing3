"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialEmbedPlugin = void 0;
const base_plugin_js_1 = require("./base-plugin.js");
class SocialEmbedPlugin extends base_plugin_js_1.BaseTCSEPlugin {
    name = 'SocialEmbedPlugin';
    async detect(context) {
        context.logger?.debug?.('SocialEmbedPlugin: Detector skeleton phase — no active DOM scanning yet.');
        return [];
    }
}
exports.SocialEmbedPlugin = SocialEmbedPlugin;
//# sourceMappingURL=social-embed-plugin.js.map