"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWidgetPlugin = void 0;
const base_plugin_js_1 = require("./base-plugin.js");
class ChatWidgetPlugin extends base_plugin_js_1.BaseTCSEPlugin {
    name = 'ChatWidgetPlugin';
    async detect(context) {
        context.logger?.debug?.('ChatWidgetPlugin: Detector skeleton phase — no active DOM scanning yet.');
        return [];
    }
}
exports.ChatWidgetPlugin = ChatWidgetPlugin;
//# sourceMappingURL=chat-widget-plugin.js.map