"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAuthAdapter = void 0;
class MockAuthAdapter {
    // Use a global mock token to simulate session persistence in memory for CLI tests
    static token = null;
    async login() {
        MockAuthAdapter.token = 'mock-oauth-token-12345';
        return { token: MockAuthAdapter.token, isAuthenticated: true, userId: 'dev-user' };
    }
    async logout() {
        MockAuthAdapter.token = null;
    }
    async getToken() {
        return MockAuthAdapter.token;
    }
    async isAuthenticated() {
        return MockAuthAdapter.token !== null;
    }
}
exports.MockAuthAdapter = MockAuthAdapter;
//# sourceMappingURL=auth-adapter.js.map