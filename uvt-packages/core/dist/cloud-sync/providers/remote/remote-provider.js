"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRemoteProvider = void 0;
class MockRemoteProvider {
    async uploadArtifact(resourceType, resourceId, payload) {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 100));
        return true; // Simulate success
    }
    async downloadArtifact(resourceType, resourceId) {
        await new Promise(r => setTimeout(r, 100));
        return null;
    }
}
exports.MockRemoteProvider = MockRemoteProvider;
//# sourceMappingURL=remote-provider.js.map