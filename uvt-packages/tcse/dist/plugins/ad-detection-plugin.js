"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdDetectionPlugin = void 0;
const signal_js_1 = require("../models/signal.js");
const ad_heuristics_js_1 = require("./ad-heuristics.js");
const ad_stabilizer_js_1 = require("../stabilization/ad-stabilizer.js");
class AdDetectionPlugin {
    name = 'AdDetectionPlugin';
    version = '1.0.0';
    enabled = true;
    async initialize(context) {
        context.logger?.debug?.('AdDetectionPlugin: Initializing non-mutating advertisement detector.');
    }
    async detect(context) {
        if (!context.page) {
            context.logger?.debug?.('AdDetectionPlugin: No Playwright page in context. Skipping browser DOM scan.');
            return [];
        }
        try {
            // Execute non-mutating browser DOM inspection
            const rawCandidates = await context.page.evaluate((params) => {
                const results = [];
                const processedElements = new Set();
                function getUniqueSelector(el) {
                    if (el.id)
                        return `#${el.id}`;
                    let path = el.tagName.toLowerCase();
                    if (el.className && typeof el.className === 'string') {
                        const classes = el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2);
                        if (classes.length > 0) {
                            path += `.${classes.join('.')}`;
                        }
                    }
                    return path;
                }
                // 1. Script Detection & Ad Library Scanning
                const scripts = Array.from(document.querySelectorAll('script[src]'));
                const activeScriptVendors = [];
                for (const s of scripts) {
                    const src = s.getAttribute('src') || '';
                    for (const sp of params.scriptPatterns) {
                        const re = new RegExp(sp.patternSource, 'i');
                        if (re.test(src)) {
                            activeScriptVendors.push({ vendor: sp.vendor, src });
                        }
                    }
                }
                // 2. Query all element candidates
                const allElements = Array.from(document.querySelectorAll('iframe, ins, div, section, aside, [class*="ad"], [id*="ad"]'));
                for (const el of allElements) {
                    if (processedElements.has(el))
                        continue;
                    const rect = el.getBoundingClientRect();
                    if (rect.width === 0 && rect.height === 0)
                        continue; // Skip collapsed/hidden elements
                    const matchedSources = [];
                    const tagName = el.tagName.toLowerCase();
                    const id = el.id || '';
                    const className = typeof el.className === 'string' ? el.className : '';
                    const src = el.getAttribute('src') || '';
                    const ariaLabel = el.getAttribute('aria-label') || '';
                    const role = el.getAttribute('role') || '';
                    // Source 1: Domain Intelligence (via iframe src)
                    if (src) {
                        for (const item of params.knownAdDomains) {
                            if (src.toLowerCase().includes(item.domain)) {
                                matchedSources.push({
                                    source: 'Domain Intelligence',
                                    weight: 0.4,
                                    detail: `Matched domain ${item.domain}`,
                                    vendor: item.vendor
                                });
                                break;
                            }
                        }
                    }
                    // Source 2: Iframe Analysis
                    if (tagName === 'iframe') {
                        const isAdFrame = id.includes('google_ads') ||
                            el.hasAttribute('data-ad-client') ||
                            el.hasAttribute('data-google-query-id') ||
                            src.includes('googlead') ||
                            src.includes('doubleclick');
                        if (isAdFrame) {
                            matchedSources.push({
                                source: 'Iframe Analysis',
                                weight: 0.3,
                                detail: `Ad iframe container identified (${id || src})`,
                                vendor: 'GoogleAdSense'
                            });
                        }
                    }
                    // Source 3: CSS Heuristics
                    const textToTest = `${id} ${className}`.toLowerCase();
                    const isCssAdMatch = /\b(ad|ads|banner-ad|sidebar-ad|google-ad|ad-unit|ad-slot|ad-container|sponsored-content)\b/i.test(textToTest);
                    if (isCssAdMatch) {
                        matchedSources.push({
                            source: 'CSS Heuristics',
                            weight: 0.2,
                            detail: `Matched ad CSS pattern in class/id (${className || id})`
                        });
                    }
                    // Source 4: ARIA Labels
                    const ariaText = `${ariaLabel} ${role}`.toLowerCase();
                    if (/\b(advertisement|sponsored|sponsor|ad)\b/i.test(ariaText)) {
                        matchedSources.push({
                            source: 'ARIA Labels',
                            weight: 0.2,
                            detail: `Matched ARIA label/role: "${ariaLabel || role}"`
                        });
                    }
                    // Source 5: Common Ad Dimensions (IAB sizes)
                    const matchedSize = params.iabSizes.find(s => Math.abs(s.width - rect.width) <= 5 && Math.abs(s.height - rect.height) <= 5);
                    if (matchedSize) {
                        matchedSources.push({
                            source: 'Common Ad Dimensions',
                            weight: 0.2,
                            detail: `Matched standard IAB ad size: ${matchedSize.name} (${matchedSize.width}x${matchedSize.height})`
                        });
                    }
                    // Source 6: Script Detection (association)
                    if (activeScriptVendors.length > 0 && (isCssAdMatch || tagName === 'iframe' || tagName === 'ins')) {
                        matchedSources.push({
                            source: 'Script Detection',
                            weight: 0.2,
                            detail: `Ad library script active (${activeScriptVendors.map(v => v.vendor).join(', ')})`,
                            vendor: activeScriptVendors[0].vendor
                        });
                    }
                    // Source 7: Mutation Observer / Dynamic insertion marker check
                    if (el.hasAttribute('data-ad-inserted') || el.hasAttribute('data-dse-mutated') || className.includes('dynamic-ad')) {
                        matchedSources.push({
                            source: 'Mutation Observer',
                            weight: 0.2,
                            detail: 'Dynamic node insertion detected in ad slot'
                        });
                    }
                    if (matchedSources.length > 0) {
                        processedElements.add(el);
                        results.push({
                            selector: getUniqueSelector(el),
                            tagName,
                            id,
                            className,
                            src,
                            ariaLabel,
                            role,
                            rect: {
                                x: Math.round(rect.x),
                                y: Math.round(rect.y),
                                width: Math.round(rect.width),
                                height: Math.round(rect.height)
                            },
                            matchedSources
                        });
                    }
                }
                return results;
            }, {
                knownAdDomains: ad_heuristics_js_1.KNOWN_AD_DOMAINS,
                cssSelectors: ad_heuristics_js_1.AD_CSS_SELECTORS,
                scriptPatterns: ad_heuristics_js_1.AD_SCRIPT_PATTERNS.map(p => ({ patternSource: p.pattern.source, vendor: p.vendor })),
                iabSizes: ad_heuristics_js_1.STANDARD_IAB_AD_SIZES
            });
            // Source 8: Network Requests (if network log present in context or page)
            const networkUrls = context.metadata?.get('networkUrls') || [];
            const signals = [];
            for (const cand of rawCandidates) {
                // Accumulate weights from all matched sources
                let totalWeight = 0;
                const sourceDetails = [];
                let vendor = 'GenericAd';
                for (const srcMatch of cand.matchedSources) {
                    totalWeight += srcMatch.weight;
                    sourceDetails.push(`[${srcMatch.source}] ${srcMatch.detail}`);
                    if (srcMatch.vendor) {
                        vendor = srcMatch.vendor;
                    }
                }
                // Check if any network URL matches ad domain for this candidate
                if (networkUrls.length > 0) {
                    const matchedNetVendor = networkUrls.map(u => (0, ad_heuristics_js_1.matchAdDomain)(u)).find(Boolean);
                    if (matchedNetVendor) {
                        totalWeight += 0.3;
                        sourceDetails.push(`[Network Requests] Matched ad network traffic (${matchedNetVendor})`);
                        vendor = matchedNetVendor;
                    }
                }
                const confidence = Math.min(1.0, Math.round(totalWeight * 100) / 100);
                if (confidence >= 0.4) {
                    signals.push((0, signal_js_1.createTCSESignal)({
                        category: 'ad',
                        type: 'ad',
                        selector: cand.selector,
                        vendor,
                        source: vendor,
                        confidenceScore: confidence,
                        confidence,
                        reason: `Advertisement detected (${confidence * 100}% confidence). Evidence: ${sourceDetails.join(' | ')}`,
                        suggestedAction: (0, ad_stabilizer_js_1.resolveAdAction)(confidence),
                        boundingBox: cand.rect,
                        attributes: {
                            tagName: cand.tagName,
                            id: cand.id,
                            className: cand.className,
                            src: cand.src || ''
                        },
                        metadata: {
                            matchedSourcesCount: cand.matchedSources.length,
                            evidence: sourceDetails
                        }
                    }));
                }
            }
            context.logger?.info?.(`AdDetectionPlugin: Detected ${signals.length} advertisement signals.`);
            return signals;
        }
        catch (err) {
            context.logger?.error?.(`AdDetectionPlugin: Browser DOM scanning failed: ${err.message}`);
            return [];
        }
    }
    async dispose() { }
}
exports.AdDetectionPlugin = AdDetectionPlugin;
//# sourceMappingURL=ad-detection-plugin.js.map