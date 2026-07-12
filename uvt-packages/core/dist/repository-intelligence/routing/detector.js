"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingDetector = void 0;
class RoutingDetector {
    name = 'RoutingDetector';
    async detect(context) {
        const deps = context.dependencies;
        let routing = 'None / Custom';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'React Router', dep: 'react-router-dom' },
            { name: 'TanStack Router', dep: '@tanstack/react-router' },
            { name: 'Next Router (App/Pages)', dep: 'next' },
            { name: 'Vue Router', dep: 'vue-router' },
            { name: 'Angular Router', dep: '@angular/router' },
            { name: 'SvelteKit Router', dep: '@sveltejs/kit' },
            { name: 'Remix Router', dep: '@remix-run/router' }
        ];
        for (const check of checks) {
            if (deps[check.dep]) {
                routing = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('routing', {
            id: 'routing',
            type: 'routing',
            name: routing,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.RoutingDetector = RoutingDetector;
//# sourceMappingURL=detector.js.map