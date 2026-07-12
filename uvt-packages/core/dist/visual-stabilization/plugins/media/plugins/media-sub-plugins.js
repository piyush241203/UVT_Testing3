"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaSubPlugins = exports.BackgroundSubPlugin = exports.LottieSubPlugin = exports.GIFSubPlugin = exports.AudioSubPlugin = exports.VideoSubPlugin = exports.SVGSubPlugin = exports.CanvasSubPlugin = exports.AvatarSubPlugin = exports.ImageSubPlugin = void 0;
const models_js_1 = require("../../../models/models.js");
class ImageSubPlugin {
    supports(s) { return s.tags.includes('HAS_DYNAMIC_IMAGE'); }
    plan(s, c, id) {
        return s.evidence.filter(e => e.type === 'dom-selector').map((e) => ({
            pluginId: id, selector: e.value, strategy: 'Mask', priority: models_js_1.PluginPriority.Low, reason: 'Dynamic Image Replacement'
        }));
    }
}
exports.ImageSubPlugin = ImageSubPlugin;
class AvatarSubPlugin {
    supports(s) { return s.tags.includes('HAS_AVATAR'); }
    plan(s, c, id) {
        return s.evidence.filter(e => e.type === 'dom-selector').map((e) => ({
            pluginId: id, selector: e.value, strategy: 'ReplaceSrc', priority: models_js_1.PluginPriority.Normal, value: c.placeholderAvatar, reason: 'Avatar Stabilization'
        }));
    }
}
exports.AvatarSubPlugin = AvatarSubPlugin;
class CanvasSubPlugin {
    supports(s) { return s.tags.includes('HAS_CANVAS'); }
    plan(s, c, id) {
        return s.evidence.filter(e => e.type === 'dom-selector').map((e) => ({
            pluginId: id, selector: e.value, strategy: 'Freeze', priority: models_js_1.PluginPriority.High, reason: 'Freeze Dynamic Canvas'
        }));
    }
}
exports.CanvasSubPlugin = CanvasSubPlugin;
class SVGSubPlugin {
    supports(s) { return s.tags.includes('HAS_SVG'); }
    plan(s, c, id) {
        return s.evidence.filter(e => e.type === 'dom-selector').map((e) => ({
            pluginId: id, selector: e.value, strategy: 'Freeze', priority: models_js_1.PluginPriority.Low, reason: 'Freeze SVG Animation'
        }));
    }
}
exports.SVGSubPlugin = SVGSubPlugin;
class VideoSubPlugin {
    supports(s) { return s.tags.includes('HAS_VIDEO'); }
    plan(s, c, id) {
        if (!c.freezeVideo)
            return [];
        return s.evidence.filter(e => e.type === 'dom-selector').map((e) => ({
            pluginId: id, selector: e.value, strategy: 'PauseMedia', priority: models_js_1.PluginPriority.High, reason: 'Pause Video Playback'
        }));
    }
}
exports.VideoSubPlugin = VideoSubPlugin;
class AudioSubPlugin {
    supports(s) { return s.tags.includes('HAS_AUDIO'); }
    plan(s, c, id) {
        return s.evidence.filter(e => e.type === 'dom-selector').map((e) => ({
            pluginId: id, selector: e.value, strategy: 'PauseMedia', priority: models_js_1.PluginPriority.Low, reason: 'Pause Audio Playback'
        }));
    }
}
exports.AudioSubPlugin = AudioSubPlugin;
class GIFSubPlugin {
    supports(s) { return s.tags.includes('HAS_GIF'); }
    plan(s, c, id) {
        if (!c.freezeGif)
            return [];
        return s.evidence.filter(e => e.type === 'dom-selector').map((e) => ({
            pluginId: id, selector: e.value, strategy: 'Freeze', priority: models_js_1.PluginPriority.Normal, reason: 'Freeze Animated GIF'
        }));
    }
}
exports.GIFSubPlugin = GIFSubPlugin;
class LottieSubPlugin {
    supports(s) { return s.tags.includes('HAS_LOTTIE'); }
    plan(s, c, id) {
        if (!c.freezeLottie)
            return [];
        return s.evidence.filter(e => e.type === 'dom-selector').map((e) => ({
            pluginId: id, selector: e.value, strategy: 'Freeze', priority: models_js_1.PluginPriority.High, reason: 'Freeze Lottie Animation'
        }));
    }
}
exports.LottieSubPlugin = LottieSubPlugin;
class BackgroundSubPlugin {
    supports(s) { return s.tags.includes('HAS_BACKGROUND'); }
    plan(s, c, id) {
        return s.evidence.filter(e => e.type === 'dom-selector').map((e) => ({
            pluginId: id, selector: e.value, strategy: 'Mask', priority: models_js_1.PluginPriority.Low, reason: 'Mask Dynamic Background'
        }));
    }
}
exports.BackgroundSubPlugin = BackgroundSubPlugin;
const getMediaSubPlugins = () => [
    new ImageSubPlugin(), new AvatarSubPlugin(), new CanvasSubPlugin(),
    new SVGSubPlugin(), new VideoSubPlugin(), new AudioSubPlugin(),
    new GIFSubPlugin(), new LottieSubPlugin(), new BackgroundSubPlugin()
];
exports.getMediaSubPlugins = getMediaSubPlugins;
//# sourceMappingURL=media-sub-plugins.js.map