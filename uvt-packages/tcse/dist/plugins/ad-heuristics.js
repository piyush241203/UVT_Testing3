"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AD_SCRIPT_PATTERNS = exports.AD_CSS_SELECTORS = exports.KNOWN_AD_DOMAINS = exports.STANDARD_IAB_AD_SIZES = void 0;
exports.isIABAdDimension = isIABAdDimension;
exports.matchAdDomain = matchAdDomain;
exports.STANDARD_IAB_AD_SIZES = [
    { name: 'Leaderboard', width: 728, height: 90 },
    { name: 'Medium Rectangle', width: 300, height: 250 },
    { name: 'Large Rectangle', width: 336, height: 280 },
    { name: 'Wide Skyscraper', width: 160, height: 600 },
    { name: 'Skyscraper', width: 120, height: 600 },
    { name: 'Half Page', width: 300, height: 600 },
    { name: 'Large Leaderboard', width: 970, height: 90 },
    { name: 'Billboard', width: 970, height: 250 },
    { name: 'Mobile Leaderboard', width: 320, height: 50 },
    { name: 'Large Mobile Banner', width: 320, height: 100 }
];
exports.KNOWN_AD_DOMAINS = [
    { domain: 'doubleclick.net', vendor: 'DoubleClick' },
    { domain: 'googlesyndication.com', vendor: 'GoogleAdSense' },
    { domain: 'googleadservices.com', vendor: 'GoogleAds' },
    { domain: 'adnxs.com', vendor: 'AppNexus' },
    { domain: 'amazon-adsystem.com', vendor: 'AmazonAds' },
    { domain: 'criteo.com', vendor: 'Criteo' },
    { domain: 'outbrain.com', vendor: 'Outbrain' },
    { domain: 'taboola.com', vendor: 'Taboola' },
    { domain: 'adroll.com', vendor: 'AdRoll' },
    { domain: 'rubiconproject.com', vendor: 'RubiconProject' },
    { domain: 'pubmatic.com', vendor: 'PubMatic' },
    { domain: 'openx.net', vendor: 'OpenX' },
    { domain: 'media.net', vendor: 'MediaNet' },
    { domain: 'popads.net', vendor: 'PopAds' },
    { domain: 'adform.net', vendor: 'Adform' }
];
exports.AD_CSS_SELECTORS = [
    '.ad',
    '.ads',
    '.banner-ad',
    '.sidebar-ad',
    '.header-ad',
    '.footer-ad',
    '#ad-slot',
    '#ad-container',
    '.ad-unit',
    '.ad-slot',
    '.ad-wrapper',
    '.ad-box',
    '.google-ad',
    '.sponsored-content',
    '[class*="ad-banner"]',
    '[class*="ad-container"]',
    '[id*="google_ads"]',
    'iframe[src*="doubleclick"]',
    'iframe[src*="googlesyndication"]',
    'iframe[src*="amazon-adsystem"]',
    'ins.adsbygoogle'
];
exports.AD_SCRIPT_PATTERNS = [
    { pattern: /adsbygoogle\.js/i, vendor: 'GoogleAdSense' },
    { pattern: /gpt\.js/i, vendor: 'GooglePublisherTag' },
    { pattern: /fbevents\.js/i, vendor: 'MetaPixel' },
    { pattern: /amazon-ads\.js/i, vendor: 'AmazonAds' },
    { pattern: /outbrain\.js/i, vendor: 'Outbrain' },
    { pattern: /taboola\.js/i, vendor: 'Taboola' },
    { pattern: /criteo\.js/i, vendor: 'Criteo' }
];
function isIABAdDimension(width, height, tolerance = 5) {
    return exports.STANDARD_IAB_AD_SIZES.find(size => Math.abs(size.width - width) <= tolerance && Math.abs(size.height - height) <= tolerance);
}
function matchAdDomain(url) {
    if (!url)
        return undefined;
    const match = exports.KNOWN_AD_DOMAINS.find(item => url.toLowerCase().includes(item.domain));
    return match?.vendor;
}
//# sourceMappingURL=ad-heuristics.js.map