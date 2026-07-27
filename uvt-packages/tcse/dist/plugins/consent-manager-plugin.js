"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentManagerPlugin = void 0;
const base_plugin_js_1 = require("./base-plugin.js");
class ConsentManagerPlugin extends base_plugin_js_1.BaseTCSEPlugin {
    name = 'ConsentManagerPlugin';
    async detect(context) {
        context.logger?.debug?.('ConsentManagerPlugin: Detector skeleton phase — no active DOM scanning yet.');
        return [];
    }
}
exports.ConsentManagerPlugin = ConsentManagerPlugin;
//# sourceMappingURL=consent-manager-plugin.js.map