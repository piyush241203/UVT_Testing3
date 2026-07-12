"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMReadyCondition = void 0;
class DOMReadyCondition {
    id = 'DOM_READY';
    page;
    priority() { return 100; } // Highest priority, check first
    async initialize(page) {
        this.page = page;
    }
    async check() {
        if (!this.page)
            return false;
        try {
            const readyState = await this.page.evaluate(() => document.readyState);
            return readyState === 'complete';
        }
        catch {
            return false;
        }
    }
    dispose() {
        this.page = null;
    }
}
exports.DOMReadyCondition = DOMReadyCondition;
//# sourceMappingURL=dom-ready.js.map