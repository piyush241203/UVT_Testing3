"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaStabilizationPlugin = void 0;
const models_js_1 = require("../../../models/models.js");
const media_planner_js_1 = require("../planner/media-planner.js");
const models_js_2 = require("../models/models.js");
const media_sub_plugins_js_1 = require("../plugins/media-sub-plugins.js");
class MediaStabilizationPlugin {
    id = 'MediaStabilizationPlugin';
    priority = models_js_1.PluginPriority.High;
    planner;
    subPlugins = (0, media_sub_plugins_js_1.getMediaSubPlugins)();
    constructor(config) {
        this.planner = new media_planner_js_1.MediaPlanner({ ...models_js_2.DEFAULT_MEDIA_CONFIG, ...config });
    }
    initialize() { }
    dispose() { }
    supports(decision) {
        return decision.evidence.some(signal => signal.tags && this.subPlugins.some(p => p.supports(signal)));
    }
    plan(decisions) {
        const signals = decisions.flatMap(d => d.evidence);
        return this.planner.plan(signals, this.id);
    }
}
exports.MediaStabilizationPlugin = MediaStabilizationPlugin;
//# sourceMappingURL=media-plugin.js.map