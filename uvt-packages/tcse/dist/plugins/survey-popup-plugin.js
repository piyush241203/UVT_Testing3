"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyPopupPlugin = void 0;
const base_plugin_js_1 = require("./base-plugin.js");
class SurveyPopupPlugin extends base_plugin_js_1.BaseTCSEPlugin {
    name = 'SurveyPopupPlugin';
    async detect(context) {
        context.logger?.debug?.('SurveyPopupPlugin: Detector skeleton phase — no active DOM scanning yet.');
        return [];
    }
}
exports.SurveyPopupPlugin = SurveyPopupPlugin;
//# sourceMappingURL=survey-popup-plugin.js.map