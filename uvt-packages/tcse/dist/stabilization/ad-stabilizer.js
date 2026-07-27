"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdStabilizer = exports.DEFAULT_AD_STABILIZER_CONFIG = void 0;
exports.resolveAdAction = resolveAdAction;
exports.DEFAULT_AD_STABILIZER_CONFIG = {
    hideThreshold: 0.95,
    placeholderThreshold: 0.90,
    maskThreshold: 0.70,
    blurThreshold: 0.50
};
/**
 * Resolves stabilization action based on confidence score and configurable thresholds.
 * 95+  -> HIDE
 * 90+  -> PLACEHOLDER
 * 70+  -> MASK
 * 50+  -> BLUR
 * <50  -> IGNORE
 */
function resolveAdAction(confidenceScore, config = {}) {
    const cfg = { ...exports.DEFAULT_AD_STABILIZER_CONFIG, ...config };
    if (confidenceScore >= cfg.hideThreshold) {
        return 'HIDE';
    }
    if (confidenceScore >= cfg.placeholderThreshold) {
        return 'PLACEHOLDER';
    }
    if (confidenceScore >= cfg.maskThreshold) {
        return 'MASK';
    }
    if (confidenceScore >= cfg.blurThreshold) {
        return 'BLUR';
    }
    return 'IGNORE';
}
class AdStabilizer {
    config;
    constructor(config = {}) {
        this.config = { ...exports.DEFAULT_AD_STABILIZER_CONFIG, ...config };
    }
    getConfig() {
        return this.config;
    }
    setConfig(config) {
        this.config = { ...this.config, ...config };
    }
    resolveAction(confidenceScore) {
        return resolveAdAction(confidenceScore, this.config);
    }
    /**
     * Applies non-shifting stabilization mode to target Playwright page element.
     */
    async stabilize(page, decision) {
        if (!page || !decision || !decision.targetSelector) {
            return false;
        }
        const actionUpper = decision.action.toUpperCase();
        if (actionUpper === 'IGNORE' || actionUpper === 'NO_ACTION') {
            return false;
        }
        try {
            return await page.evaluate((params) => {
                const el = document.querySelector(params.selector);
                if (!el)
                    return false;
                const computed = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                const width = computed.width !== 'auto' ? computed.width : `${rect.width}px`;
                const height = computed.height !== 'auto' ? computed.height : `${rect.height}px`;
                const marginTop = computed.marginTop;
                const marginRight = computed.marginRight;
                const marginBottom = computed.marginBottom;
                const marginLeft = computed.marginLeft;
                const paddingTop = computed.paddingTop;
                const paddingRight = computed.paddingRight;
                const paddingBottom = computed.paddingBottom;
                const paddingLeft = computed.paddingLeft;
                const action = params.action.toUpperCase();
                if (action === 'PLACEHOLDER') {
                    // Lock exact box model properties to prevent CLS
                    el.style.setProperty('width', width, 'important');
                    el.style.setProperty('height', height, 'important');
                    el.style.setProperty('margin-top', marginTop, 'important');
                    el.style.setProperty('margin-right', marginRight, 'important');
                    el.style.setProperty('margin-bottom', marginBottom, 'important');
                    el.style.setProperty('margin-left', marginLeft, 'important');
                    el.style.setProperty('padding-top', paddingTop, 'important');
                    el.style.setProperty('padding-right', paddingRight, 'important');
                    el.style.setProperty('padding-bottom', paddingBottom, 'important');
                    el.style.setProperty('padding-left', paddingLeft, 'important');
                    el.style.setProperty('box-sizing', 'border-box', 'important');
                    el.style.setProperty('background-color', '#f1f5f9', 'important');
                    el.style.setProperty('border', '1px dashed #cbd5e1', 'important');
                    el.style.setProperty('opacity', '1', 'important');
                    // Remove dynamic inner children to freeze visual contents while holding space
                    el.innerHTML = '';
                    return true;
                }
                if (action === 'HIDE') {
                    // Preserve space to prevent CLS while hiding contents
                    el.style.setProperty('visibility', 'hidden', 'important');
                    return true;
                }
                if (action === 'BLUR') {
                    el.style.setProperty('filter', 'blur(12px)', 'important');
                    el.style.setProperty('overflow', 'hidden', 'important');
                    return true;
                }
                if (action === 'MASK') {
                    el.style.setProperty('background-color', '#e2e8f0', 'important');
                    el.style.setProperty('color', 'transparent', 'important');
                    el.style.setProperty('pointer-events', 'none', 'important');
                    return true;
                }
                return false;
            }, { selector: decision.targetSelector, action: decision.action });
        }
        catch (err) {
            return false;
        }
    }
}
exports.AdStabilizer = AdStabilizer;
//# sourceMappingURL=ad-stabilizer.js.map