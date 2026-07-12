"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingDetector = void 0;
class TestingDetector {
    name = 'TestingDetector';
    async detect(context) {
        const deps = context.dependencies;
        let testing = 'None';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Playwright', dep: '@playwright/test' },
            { name: 'Cypress', dep: 'cypress' },
            { name: 'Vitest', dep: 'vitest' },
            { name: 'Jest', dep: 'jest' },
            { name: 'Mocha', dep: 'mocha' },
            { name: 'Testing Library', dep: '@testing-library/react' }
        ];
        for (const check of checks) {
            if (deps[check.dep]) {
                testing = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('testing', {
            id: 'testing',
            type: 'testing',
            name: testing,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.TestingDetector = TestingDetector;
//# sourceMappingURL=detector.js.map