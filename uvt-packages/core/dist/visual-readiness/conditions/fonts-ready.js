"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontsReadyCondition = void 0;
class FontsReadyCondition {
    id = 'FONTS_READY';
    page;
    priority() { return 80; }
    async initialize(page) {
        this.page = page;
    }
    async check() {
        if (!this.page)
            return false;
        try {
            return await this.page.evaluate(() => {
                return document.fonts ? document.fonts.status === 'loaded' : true;
            });
        }
        catch {
            return true; // Fallback to ready if API not supported
        }
    }
    dispose() {
        this.page = null;
    }
}
exports.FontsReadyCondition = FontsReadyCondition;
//# sourceMappingURL=fonts-ready.js.map