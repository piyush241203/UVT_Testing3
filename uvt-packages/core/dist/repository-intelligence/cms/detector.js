"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSDetector = void 0;
class CMSDetector {
    name = 'CMSDetector';
    async detect(context) {
        const deps = context.dependencies;
        let cms = 'None';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Sanity', dep: '@sanity/client' },
            { name: 'Contentful', dep: 'contentful' },
            { name: 'Strapi', dep: '@strapi/strapi' },
            { name: 'Ghost', dep: '@tryghost/content-api' },
            { name: 'Prismic', dep: '@prismicio/client' },
            { name: 'Builder.io', dep: '@builder.io/react' }
        ];
        for (const check of checks) {
            if (deps[check.dep]) {
                cms = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('cms', {
            id: 'cms',
            type: 'cms',
            name: cms,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.CMSDetector = CMSDetector;
//# sourceMappingURL=detector.js.map