"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesReadyCondition = void 0;
class ImagesReadyCondition {
    id = 'IMAGES_READY';
    page;
    priority() { return 70; }
    async initialize(page) {
        this.page = page;
    }
    async check() {
        if (!this.page)
            return false;
        try {
            return await this.page.evaluate(() => {
                const images = Array.from(document.querySelectorAll('img'));
                return images.every(img => img.complete && img.naturalWidth > 0);
            });
        }
        catch {
            return true;
        }
    }
    dispose() {
        this.page = null;
    }
}
exports.ImagesReadyCondition = ImagesReadyCondition;
//# sourceMappingURL=images-ready.js.map