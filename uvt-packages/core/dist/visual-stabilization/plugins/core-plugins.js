"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPlugins = exports.CustomPlugin = exports.CarouselPlugin = exports.SkeletonPlugin = exports.LiveRegionPlugin = exports.NotificationPlugin = exports.RealtimePlugin = exports.FormPlugin = exports.CSSPlugin = void 0;
const models_js_1 = require("../models/models.js");
class BasePlugin {
    id;
    priority;
    constructor(id, priority) {
        this.id = id;
        this.priority = priority;
    }
    initialize() { }
    dispose() { }
}
// Generates boilerplate for all requested plugins
const index_js_1 = require("./temporal/index.js");
const index_js_2 = require("./identity/index.js");
const index_js_3 = require("./media/index.js");
const index_js_4 = require("./rendering/index.js");
class CSSPlugin extends BasePlugin {
    constructor() { super('CSSPlugin', models_js_1.PluginPriority.Normal); }
    supports(d) { return false; }
    plan(decisions) { return []; }
}
exports.CSSPlugin = CSSPlugin;
class FormPlugin extends BasePlugin {
    constructor() { super('FormPlugin', models_js_1.PluginPriority.Normal); }
    supports(d) { return d.evidence.some(s => s.tags?.includes('HAS_FORM_CONTROL')); }
    plan(decisions) { return []; }
}
exports.FormPlugin = FormPlugin;
class RealtimePlugin extends BasePlugin {
    constructor() { super('RealtimePlugin', models_js_1.PluginPriority.Critical); }
    supports(d) { return d.evidence.some(s => s.tags?.includes('USES_REALTIME_STREAM')); }
    plan(decisions) { return []; }
}
exports.RealtimePlugin = RealtimePlugin;
class NotificationPlugin extends BasePlugin {
    constructor() { super('NotificationPlugin', models_js_1.PluginPriority.High); }
    supports(d) { return d.evidence.some(s => s.tags?.includes('HAS_TOAST') || s.tags?.includes('HAS_NOTIFICATION')); }
    plan(decisions) { return []; }
}
exports.NotificationPlugin = NotificationPlugin;
class LiveRegionPlugin extends BasePlugin {
    constructor() { super('LiveRegionPlugin', models_js_1.PluginPriority.High); }
    supports(d) { return d.evidence.some(s => s.tags?.includes('HAS_ARIA_LIVE')); }
    plan(decisions) { return []; }
}
exports.LiveRegionPlugin = LiveRegionPlugin;
class SkeletonPlugin extends BasePlugin {
    constructor() { super('SkeletonPlugin', models_js_1.PluginPriority.Low); }
    supports(d) { return d.evidence.some(s => s.tags?.includes('HAS_SKELETON')); }
    plan(decisions) { return []; }
}
exports.SkeletonPlugin = SkeletonPlugin;
class CarouselPlugin extends BasePlugin {
    constructor() { super('CarouselPlugin', models_js_1.PluginPriority.Normal); }
    supports(d) { return d.evidence.some(s => s.tags?.includes('HAS_CAROUSEL')); }
    plan(decisions) { return []; }
}
exports.CarouselPlugin = CarouselPlugin;
class CustomPlugin extends BasePlugin {
    constructor() { super('CustomPlugin', models_js_1.PluginPriority.Normal); }
    supports(d) { return false; }
    plan(decisions) { return []; }
}
exports.CustomPlugin = CustomPlugin;
const getAllPlugins = () => [
    new index_js_1.TemporalStabilizationPlugin(),
    new index_js_2.IdentityStabilizationPlugin(),
    new index_js_3.MediaStabilizationPlugin(),
    new index_js_4.RenderingStabilizationPlugin(),
    new CSSPlugin(),
    new FormPlugin(), new RealtimePlugin(),
    new NotificationPlugin(), new LiveRegionPlugin(), new SkeletonPlugin(),
    new CarouselPlugin(), new CustomPlugin()
];
exports.getAllPlugins = getAllPlugins;
//# sourceMappingURL=core-plugins.js.map