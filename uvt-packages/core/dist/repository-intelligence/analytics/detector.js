"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsDetector = void 0;
class AnalyticsDetector {
    name = 'AnalyticsDetector';
    async detect(context) {
        const deps = context.dependencies;
        let analytics = 'None';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Segment', dep: '@segment/analytics-next' },
            { name: 'Google Analytics', dep: 'react-ga4' },
            { name: 'PostHog', dep: 'posthog-js' },
            { name: 'Mixpanel', dep: 'mixpanel-browser' },
            { name: 'Amplitude', dep: '@amplitude/analytics-browser' },
            { name: 'Plausible', dep: 'plausible-tracker' }
        ];
        for (const check of checks) {
            if (deps[check.dep]) {
                analytics = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('analytics', {
            id: 'analytics',
            type: 'analytics',
            name: analytics,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.AnalyticsDetector = AnalyticsDetector;
//# sourceMappingURL=detector.js.map