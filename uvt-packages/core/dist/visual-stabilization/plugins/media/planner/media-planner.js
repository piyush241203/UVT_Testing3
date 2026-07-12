"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaPlanner = void 0;
const media_sub_plugins_js_1 = require("../plugins/media-sub-plugins.js");
class MediaPlanner {
    config;
    subPlugins;
    constructor(config) {
        this.config = config;
        this.subPlugins = (0, media_sub_plugins_js_1.getMediaSubPlugins)();
    }
    plan(signals, pluginId) {
        if (!this.config.enabled)
            return [];
        const actions = [];
        for (const signal of signals) {
            if (!signal.evidence)
                continue;
            for (const subPlugin of this.subPlugins) {
                if (subPlugin.supports(signal)) {
                    actions.push(...subPlugin.plan(signal, this.config, pluginId));
                }
            }
        }
        return actions;
    }
}
exports.MediaPlanner = MediaPlanner;
//# sourceMappingURL=media-planner.js.map