"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyMaskingStabilizer = void 0;
class LegacyMaskingStabilizer {
    name = 'LegacyMaskingStabilizer';
    context;
    localValues = [];
    constructor(localValues) {
        this.localValues = localValues;
    }
    initialize(context) {
        this.context = context;
        this.context.logger.debug(`[${this.name}] Initialized legacy masking stabilizer.`);
    }
    supports(signals) {
        return true; // Always runs as a fallback for legacy integration
    }
    async stabilize(signals) {
        const start = Date.now();
        let tracerId;
        let tracerInstance;
        try {
            const { VisualObservabilityEngine } = await import('../../visual-observability/index.js');
            const voe = new VisualObservabilityEngine();
            tracerInstance = voe.createTracer(`trace-${Date.now()}`);
            if (this.context) {
                this.context.tracer = tracerInstance;
            }
            tracerId = tracerInstance.startSpan('PipelineExecution');
        }
        catch (e) { }
        if (!this.context?.page) {
            if (tracerInstance && tracerId) {
                tracerInstance.endSpan(tracerId);
            }
            return { success: false, modifiedSelectors: [], error: new Error('No page in context.'), executionTimeMs: 0 };
        }
        try {
            const { VisualRegionEngine } = await import('../../visual-region/index.js');
            const vrege = new VisualRegionEngine();
            const vregeResult = await vrege.evaluate(this.context.page, signals, this.context);
            this.context.runtimeMetadata.set('regionGraph', vregeResult.graph);
            const { DynamicDecisionEngine } = await import('../../dynamic-decision/index.js');
            const dde = new DynamicDecisionEngine();
            const decisions = dde.evaluate(vregeResult.signals);
            const { FrameworkOptimizationEngine } = await import('../../framework-optimization/index.js');
            const foe = new FrameworkOptimizationEngine();
            const optimizedDecisions = foe.optimize(decisions, this.context);
            const { VisualStabilizationEngine } = await import('../../visual-stabilization/index.js');
            const vse = new VisualStabilizationEngine();
            const vseResult = await vse.stabilize(this.context.page, optimizedDecisions); // Cast as any if VSE types not fully updated
            this.context.logger.debug(`[LegacyMaskingStabilizer] VSE Executed: ${vseResult.actionsPlanned} actions planned.`);
            this.context.runtimeMetadata.set('stabilizationMetadata', vseResult);
            try {
                const { VisualQualityEngine } = await import('../../visual-quality/index.js');
                const vqe = new VisualQualityEngine();
                await vqe.evaluate(this.context, vseResult);
            }
            catch (vqeErr) {
                this.context.logger.warn(`VQE evaluation failed: ${vqeErr}`);
            }
        }
        catch (e) {
            this.context.logger.error(`[LegacyMaskingStabilizer] Stabilization failed: ${e}`);
        }
        finally {
            if (tracerInstance && tracerId) {
                tracerInstance.endSpan(tracerId);
                try {
                    const { VisualObservabilityEngine } = await import('../../visual-observability/index.js');
                    const voe = new VisualObservabilityEngine();
                    await voe.exportTrace(tracerInstance, this.context);
                }
                catch (e) { }
            }
        }
        // Prepare combined values (from network signals + local values)
        const interceptedValues = signals
            .filter(s => s.category === 'NETWORK' && Array.isArray(s.metadata.interceptedValues))
            .flatMap(s => s.metadata.interceptedValues);
        const combinedValues = [...new Set([...this.localValues, ...interceptedValues])];
        try {
            await this.context.page.evaluate((valuesToMask) => {
                // NOTE: Do NOT freeze/replace window.setTimeout or window.setInterval.
                // Doing so corrupts React's fiber scheduler and other framework internals,
                // which breaks the Playwright CDP connection and causes Percy snapshots to fail
                // with "Target page, context or browser has been closed".
                // Dynamic text masking (below) is sufficient for visual stability.
                const isDynamicText = (text) => {
                    const cleanText = text.trim();
                    if (!cleanText)
                        return false;
                    const dateRegex = /\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?|\d{2}\/\d{2}\/\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}/i;
                    const utcRegex = /[a-z]{3},\s+\d{2}\s+[a-z]{3}\s+\d{4}\s+\d{2}:\d{2}:\d{2}/i;
                    const timeRegex = /\b\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?\b/i;
                    const relativeTimeRegex = /\b\d+\s+(?:second|minute|min|hour|day|week|month|year)s?\s+ago\b/i;
                    const currencyRegex = /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/;
                    const keyRegex = /(?:sess|evt_live|txn|usr|notif)_[a-zA-Z0-9]+/;
                    const tickRegex = /\b\d+\s+(?:tick|run)s?\b/i;
                    if (dateRegex.test(cleanText) || utcRegex.test(cleanText) || timeRegex.test(cleanText) || relativeTimeRegex.test(cleanText) || currencyRegex.test(cleanText) || keyRegex.test(cleanText) || tickRegex.test(cleanText)) {
                        return true;
                    }
                    for (const dVal of valuesToMask) {
                        if (dVal && cleanText.toLowerCase().includes(dVal.toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                };
                const sortedValues = [...valuesToMask].sort((a, b) => b.length - a.length);
                const maskString = (val) => {
                    val = val.replace(/(sess|evt_live|txn|usr|notif)_[a-zA-Z0-9]+/g, (match, prefix) => `${prefix}_MASKEDKEY`);
                    val = val.replace(/\b\d+\s+(?:second|minute|min|hour|day|week|month|year)s?\s+ago\b/ig, 'SOME_TIME_AGO');
                    val = val.replace(/\b\d+\s+(?:tick|run)s?\b/ig, 'XX ticks');
                    val = val.replace(/[a-z]{3},\s+\d{2}\s+[a-z]{3}\s+\d{4}\s+\d{2}:\d{2}:\d{2}(?:\s+[a-z]+)?/ig, 'Mon, 01 Jan 2026 00:00:00 GMT');
                    val = val.replace(/\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?/g, '2026-01-01T00:00:00Z');
                    val = val.replace(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}/ig, 'January 01, 2026');
                    val = val.replace(/\b\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?\b/ig, '12:00:00 AM');
                    val = val.replace(/\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g, '$999,999.99');
                    for (const dVal of sortedValues) {
                        if (dVal && val.toLowerCase().includes(dVal.toLowerCase())) {
                            const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const regex = new RegExp(escapeRegExp(dVal), 'gi');
                            val = val.replace(regex, '[DYNAMIC_DATA]');
                        }
                    }
                    return val;
                };
                const applyTextMasking = () => {
                    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
                    const nodesToMask = [];
                    let node;
                    while ((node = walker.nextNode())) {
                        if (node.parentElement && node.textContent && isDynamicText(node.textContent)) {
                            if (node.parentElement.closest('[data-percy-ignore], .percy-ignore'))
                                continue;
                            nodesToMask.push(node);
                        }
                    }
                    for (const textNode of nodesToMask) {
                        if (textNode.textContent) {
                            const masked = maskString(textNode.textContent);
                            if (textNode.textContent !== masked) {
                                textNode.textContent = masked;
                            }
                        }
                    }
                    const elements = document.querySelectorAll('input, textarea, [placeholder], [title], [alt]');
                    for (const el of elements) {
                        if (el.closest('[data-percy-ignore], .percy-ignore'))
                            continue;
                        const htmlEl = el;
                        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                            const val = htmlEl.value;
                            if (val && isDynamicText(val)) {
                                const maskedVal = maskString(val);
                                if (htmlEl.value !== maskedVal) {
                                    htmlEl.value = maskedVal;
                                }
                            }
                        }
                        for (const attr of ['placeholder', 'title', 'alt']) {
                            const val = el.getAttribute(attr);
                            if (val && isDynamicText(val)) {
                                const maskedAttr = maskString(val);
                                if (val !== maskedAttr) {
                                    el.setAttribute(attr, maskedAttr);
                                }
                            }
                        }
                    }
                };
                applyTextMasking();
                // ── Dynamic element visual blurring (non-ad) ──────────────────────────
                const dynamicSelectors = [
                    '[id*="date" i]', '[id*="time" i]', '[id*="clock" i]',
                    '[class*="date" i]', '[class*="time" i]', '[class*="clock" i]',
                    '[id*="token" i]', '[class*="token" i]',
                    '[id*="uuid" i]', '[class*="uuid" i]',
                    '[data-uvt-dynamic]', '[data-uvt-dynamic] *',
                    '[class*="dynamic" i]', '[id*="dynamic" i]',
                    '[class*="random" i]', '[id*="random" i]',
                    'canvas', 'img[src*="avatar" i]', 'img[src*="pravatar" i]',
                    '[class*="avatar" i]', '[id*="avatar" i]'
                ];
                dynamicSelectors.forEach(sel => {
                    try {
                        document.querySelectorAll(sel).forEach(el => {
                            const htmlEl = el;
                            htmlEl.style.setProperty('filter', 'blur(6px)', 'important');
                            htmlEl.style.setProperty('opacity', '0.4', 'important');
                        });
                    }
                    catch { }
                });
                // ── Ad Removal — CSS <style> injection (React/SPA-safe) ──────────────
                //
                // IMPORTANT: We use CSS injection instead of direct DOM mutation.
                //
                // WHY: Setting `innerHTML = ''` or `style.display = 'none'` directly on
                // ad DOM elements triggers React's (and Vue's/Angular's) virtual DOM
                // reconciler, which immediately RESTORES the element from virtual state.
                // The ad appears to be hidden for ~1ms and then React re-renders it back.
                //
                // CSS injection via a <style> tag operates at the browser rendering layer,
                // BELOW the framework runtime. The framework cannot "undo" CSS rules
                // because CSS is applied by the browser engine independently of JS.
                // This means ad elements stay hidden even through React re-renders.
                //
                // For Percy's cloud renderer, the percyCSS option handles this independently.
                // ─────────────────────────────────────────────────────────────────────
                const adCSSSelectors = [
                    /* Google AdSense & DFP */
                    'ins.adsbygoogle',
                    'ins[data-ad-client]',
                    'ins[data-ad-slot]',
                    'iframe[src*="googlesyndication"]',
                    'iframe[src*="doubleclick"]',
                    'iframe[src*="googleadservices"]',
                    'iframe[id*="google_ads"]',
                    '[id*="google_ads"]',
                    '[class*="google-auto-placed"]',
                    '[data-ad-client]',
                    '[data-ad-slot]',
                    '[data-google-query-id]',
                    /* Ad Networks */
                    'iframe[src*="adnxs"]',
                    'iframe[src*="taboola"]',
                    'iframe[src*="outbrain"]',
                    'iframe[src*="media.net"]',
                    /* IAB Standard Heuristics — CASE-INSENSITIVE attribute selectors */
                    '[class*="ad-banner" i]',
                    '[class*="ad-container" i]',
                    '[class*="ad-wrapper" i]',
                    '[class*="ad-slot" i]',
                    '[class*="ad-unit" i]',
                    '[class*="ad-block" i]',
                    '[class*="adslot" i]',
                    '[class*="adunit" i]',
                    '[class*="adbanner" i]',
                    '[class*="sidebar-ad" i]',
                    '[class*="advertisement" i]',
                    '[class*="advertising" i]',
                    '[id*="ad-banner" i]',
                    '[id*="ad-container" i]',
                    '[id*="ad-slot" i]',
                    '[id*="ad-unit" i]',
                    '[id*="advertisement" i]',
                    '[id*="sidebar-ad" i]',
                    /* Sponsored Content */
                    '[class*="sponsor" i]',
                    '[id*="sponsor" i]',
                    '[class*="sponsored-content" i]',
                    '[class*="sponsored-card" i]',
                    '[class*="promoted-content" i]',
                    '[class*="native-ad" i]',
                    /* Cookie & GDPR Banners */
                    '[class*="cookie-banner" i]',
                    '[class*="cookie-consent" i]',
                    '[class*="gdpr-banner" i]',
                    '[class*="consent-banner" i]',
                    '[id*="cookie-banner" i]',
                    '[id*="cookie-consent" i]',
                    '#cookie-consent',
                    '.cookie-banner',
                    /* Popups & Chat Widgets */
                    '[class*="newsletter-popup" i]',
                    '[class*="chat-widget" i]',
                    '[class*="intercom" i]',
                    '[class*="drift-widget" i]',
                    '.newsletter-popup',
                    /* UVT hide attributes */
                    '[data-percy-hide="true"]',
                    '[data-percy-ignore="true"]'
                ];
                // Build CSS text from all ad selectors
                const adCSSText = adCSSSelectors.join(',\n') + ` {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  overflow: hidden !important;
}`;
                // Inject (or update) the UVT ad-hiding stylesheet
                const adStyleId = '__uvt_ad_hide__';
                let adStyle = document.getElementById(adStyleId);
                if (!adStyle) {
                    adStyle = document.createElement('style');
                    adStyle.id = adStyleId;
                    adStyle.setAttribute('data-uvt', 'ad-hide');
                    (document.head || document.documentElement).appendChild(adStyle);
                }
                adStyle.textContent = adCSSText;
                // Also mark elements with data attributes for Percy's serializer
                // Note: We do NOT mutate innerHTML here — that triggers framework reconciliation
                adCSSSelectors.forEach(sel => {
                    try {
                        document.querySelectorAll(sel).forEach(el => {
                            el.setAttribute('data-percy-hide', 'true');
                            el.setAttribute('data-percy-ignore', 'true');
                        });
                    }
                    catch { }
                });
                // ── MutationObserver: re-apply text masking when DOM changes ──────────
                // We do NOT re-apply ad hiding in the observer because:
                //   1. The CSS <style> tag persists automatically — no re-application needed
                //   2. Re-applying DOM-level hiding in the observer creates race conditions with React
                const observer = new MutationObserver(() => {
                    observer.disconnect();
                    try {
                        applyTextMasking();
                        // Ensure ad style tag wasn't removed by framework hot-reload
                        const styleCheck = document.getElementById(adStyleId);
                        if (!styleCheck) {
                            const freshStyle = document.createElement('style');
                            freshStyle.id = adStyleId;
                            freshStyle.setAttribute('data-uvt', 'ad-hide');
                            freshStyle.textContent = adCSSText;
                            (document.head || document.documentElement).appendChild(freshStyle);
                        }
                    }
                    finally {
                        observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: true });
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: true });
            }, combinedValues);
            return { success: true, modifiedSelectors: [], executionTimeMs: Date.now() - start };
        }
        catch (e) {
            this.context.logger.error(`[${this.name}] Masking error: ${e.message}`);
            return { success: false, modifiedSelectors: [], error: e, executionTimeMs: Date.now() - start };
        }
    }
    dispose() { }
}
exports.LegacyMaskingStabilizer = LegacyMaskingStabilizer;
//# sourceMappingURL=legacy-masking-stabilizer.js.map