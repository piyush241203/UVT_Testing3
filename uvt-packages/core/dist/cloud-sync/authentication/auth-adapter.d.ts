import { AuthContext } from '../models/models.js';
export interface AuthAdapter {
    login(): Promise<AuthContext>;
    logout(): Promise<void>;
    getToken(): Promise<string | null>;
    isAuthenticated(): Promise<boolean>;
}
export declare class MockAuthAdapter implements AuthAdapter {
    private static token;
    login(): Promise<AuthContext>;
    logout(): Promise<void>;
    getToken(): Promise<string | null>;
    isAuthenticated(): Promise<boolean>;
}
//# sourceMappingURL=auth-adapter.d.ts.map