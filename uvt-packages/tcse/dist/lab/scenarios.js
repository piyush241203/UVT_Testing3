"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCSE_LAB_SCENARIOS = void 0;
exports.TCSE_LAB_SCENARIOS = [
    // ─── 11 Advertisement Scenarios ──────────────────────────────────────────
    {
        id: 'ad-google-adsense',
        name: 'Google AdSense Banner',
        group: 'ad',
        provider: 'Google AdSense',
        elementMetadata: {
            tagName: 'ins',
            className: 'adsbygoogle',
            ariaLabel: 'advertisement',
            width: 728,
            height: 90
        },
        expectedConfidence: 0.95,
        expectedMode: 'HIDE'
    },
    {
        id: 'ad-google-ad-manager',
        name: 'Google Ad Manager (DFP)',
        group: 'ad',
        provider: 'Google Ad Manager',
        elementMetadata: {
            tagName: 'div',
            id: 'google_ads_iframe_/12345/home_leaderboard_0',
            className: 'dfp-ad-unit',
            ariaLabel: 'advertisement',
            width: 300,
            height: 250
        },
        expectedConfidence: 0.95,
        expectedMode: 'HIDE'
    },
    {
        id: 'ad-amazon-ads',
        name: 'Amazon Ad System Banner',
        group: 'ad',
        provider: 'Amazon Ads',
        elementMetadata: {
            tagName: 'iframe',
            src: 'https://aax.amazon-adsystem.com/e/dtb/bid',
            width: 300,
            height: 250
        },
        expectedConfidence: 0.78,
        expectedMode: 'PLACEHOLDER'
    },
    {
        id: 'ad-meta-audience-network',
        name: 'Meta Audience Network Ad',
        group: 'ad',
        provider: 'Meta Audience Network',
        elementMetadata: {
            tagName: 'div',
            className: 'fb-ad-unit facebook-sponsored',
            ariaLabel: 'sponsored content',
            width: 300,
            height: 250
        },
        expectedConfidence: 0.78,
        expectedMode: 'PLACEHOLDER'
    },
    {
        id: 'ad-taboola',
        name: 'Taboola Recommendation Feed',
        group: 'ad',
        provider: 'Taboola',
        elementMetadata: {
            tagName: 'div',
            id: 'taboola-below-article-thumbnails',
            className: 'trc_related_container',
            width: 1000,
            height: 400
        },
        expectedConfidence: 0.78,
        expectedMode: 'PLACEHOLDER'
    },
    {
        id: 'ad-outbrain',
        name: 'Outbrain Native Recommendation',
        group: 'ad',
        provider: 'Outbrain',
        elementMetadata: {
            tagName: 'div',
            className: 'OUTBRAIN outbrain-widget',
            width: 1000,
            height: 400
        },
        expectedConfidence: 0.78,
        expectedMode: 'PLACEHOLDER'
    },
    {
        id: 'ad-media-net',
        name: 'Media.net Contextual Ad',
        group: 'ad',
        provider: 'Media.net',
        elementMetadata: {
            tagName: 'div',
            id: 'mnet_ad_header_728',
            className: 'mnet-ad-container',
            width: 728,
            height: 90
        },
        expectedConfidence: 0.78,
        expectedMode: 'PLACEHOLDER'
    },
    {
        id: 'ad-criteo',
        name: 'Criteo Retargeting Banner',
        group: 'ad',
        provider: 'Criteo',
        elementMetadata: {
            tagName: 'div',
            className: 'criteo-ad-container criteo-banner',
            width: 300,
            height: 250
        },
        expectedConfidence: 0.78,
        expectedMode: 'PLACEHOLDER'
    },
    {
        id: 'ad-revcontent',
        name: 'RevContent Native Grid',
        group: 'ad',
        provider: 'RevContent',
        elementMetadata: {
            tagName: 'div',
            id: 'rc-widget-1234',
            className: 'revcontent-widget',
            width: 1000,
            height: 350
        },
        expectedConfidence: 0.78,
        expectedMode: 'PLACEHOLDER'
    },
    {
        id: 'ad-affiliate',
        name: 'Affiliate Marketing Banner',
        group: 'ad',
        provider: 'Affiliate Network',
        elementMetadata: {
            tagName: 'a',
            className: 'affiliate-link sponsor-banner',
            src: 'https://affiliate-tracker.com/banner.png',
            width: 300,
            height: 250
        },
        expectedConfidence: 0.60,
        expectedMode: 'MASK'
    },
    {
        id: 'ad-internal',
        name: 'Internal Marketing House Banner',
        group: 'ad',
        provider: 'Internal Marketing',
        elementMetadata: {
            tagName: 'div',
            className: 'internal-marketing-banner promo-box',
            width: 1200,
            height: 120
        },
        expectedConfidence: 0.60,
        expectedMode: 'MASK'
    },
    // ─── 8 Other TCSE Certification Groups ──────────────────────────────────
    {
        id: 'cookie-onetrust',
        name: 'OneTrust Cookie Consent Banner',
        group: 'cookie_banner',
        provider: 'OneTrust',
        elementMetadata: {
            tagName: 'div',
            id: 'onetrust-consent-sdk',
            className: 'onetrust-banner-sdk'
        },
        expectedConfidence: 0.95,
        expectedMode: 'HIDE'
    },
    {
        id: 'chat-intercom',
        name: 'Intercom Live Chat Launcher',
        group: 'chat_widget',
        provider: 'Intercom',
        elementMetadata: {
            tagName: 'div',
            id: 'intercom-container',
            className: 'intercom-lightweight-app'
        },
        expectedConfidence: 0.90,
        expectedMode: 'HIDE'
    },
    {
        id: 'popup-newsletter',
        name: 'Klaviyo Lead Capture Popup',
        group: 'newsletter_popup',
        provider: 'Klaviyo',
        elementMetadata: {
            tagName: 'div',
            className: 'klaviyo-form newsletter-overlay-modal'
        },
        expectedConfidence: 0.88,
        expectedMode: 'HIDE'
    },
    {
        id: 'survey-hotjar',
        name: 'Hotjar NPS Feedback Survey',
        group: 'survey_popup',
        provider: 'Hotjar',
        elementMetadata: {
            tagName: 'div',
            id: '_hj_feedback_container',
            className: 'hj-survey-popup'
        },
        expectedConfidence: 0.88,
        expectedMode: 'HIDE'
    },
    {
        id: 'consent-cookiebot',
        name: 'Cookiebot Consent Dialog',
        group: 'consent_manager',
        provider: 'Cookiebot',
        elementMetadata: {
            tagName: 'div',
            id: 'CybotCookiebotDialog',
            className: 'cookiebot-dialog'
        },
        expectedConfidence: 0.92,
        expectedMode: 'HIDE'
    },
    {
        id: 'recommendation-zemanta',
        name: 'Zemanta Recommendation Widget',
        group: 'recommendation_widget',
        provider: 'Zemanta',
        elementMetadata: {
            tagName: 'div',
            className: 'zemanta-recommendation-box'
        },
        expectedConfidence: 0.85,
        expectedMode: 'PLACEHOLDER'
    },
    {
        id: 'social-twitter',
        name: 'Twitter/X Post Embed',
        group: 'social_embed',
        provider: 'Twitter / X',
        elementMetadata: {
            tagName: 'iframe',
            src: 'https://platform.twitter.com/embed/Tweet.html'
        },
        expectedConfidence: 0.85,
        expectedMode: 'PLACEHOLDER'
    },
    {
        id: 'analytics-hotjar-heatmap',
        name: 'Hotjar Heatmap Recording Overlay',
        group: 'analytics_overlay',
        provider: 'Hotjar Analytics',
        elementMetadata: {
            tagName: 'div',
            id: 'hj-recording-badge',
            className: 'hj-tracking-overlay'
        },
        expectedConfidence: 0.85,
        expectedMode: 'HIDE'
    }
];
//# sourceMappingURL=scenarios.js.map