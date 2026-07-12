"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDetector = void 0;
class AuthDetector {
    name = 'AuthDetector';
    async detect(context) {
        const deps = context.dependencies;
        let auth = 'None / Custom';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'NextAuth', dep: 'next-auth' },
            { name: 'Clerk', dep: '@clerk/clerk-react' },
            { name: 'Auth0', dep: '@auth0/auth0-react' },
            { name: 'Firebase Auth', dep: 'firebase' }, // Firebase covers multiple things, but often implies auth
            { name: 'Supabase Auth', dep: '@supabase/supabase-js' },
            { name: 'Passport', dep: 'passport' },
            { name: 'Keycloak', dep: 'keycloak-js' },
            { name: 'AWS Cognito', dep: 'amazon-cognito-identity-js' },
            { name: 'Better Auth', dep: 'better-auth' },
            { name: 'JWT', dep: 'jsonwebtoken' }
        ];
        for (const check of checks) {
            if (deps[check.dep] || (check.dep.startsWith('@clerk') && Object.keys(deps).some(d => d.startsWith('@clerk')))) {
                auth = check.name;
                confidence = 0.9; // 0.9 because firebase/supabase could be just DB, but it's a strong auth signal
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('auth', {
            id: 'auth',
            type: 'auth',
            name: auth,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.AuthDetector = AuthDetector;
//# sourceMappingURL=detector.js.map