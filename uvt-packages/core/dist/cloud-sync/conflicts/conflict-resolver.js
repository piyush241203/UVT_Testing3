"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictResolver = void 0;
class ConflictResolver {
    policy;
    constructor(policy = 'local-wins') {
        this.policy = policy;
    }
    resolve(localArtifact, remoteArtifact) {
        if (!remoteArtifact)
            return localArtifact;
        if (!localArtifact)
            return remoteArtifact;
        switch (this.policy) {
            case 'remote-wins': return remoteArtifact;
            case 'newest-timestamp':
                const localTime = new Date(localArtifact.timestamp || 0).getTime();
                const remoteTime = new Date(remoteArtifact.timestamp || 0).getTime();
                return localTime > remoteTime ? localArtifact : remoteArtifact;
            case 'local-wins':
            default:
                return localArtifact;
        }
    }
}
exports.ConflictResolver = ConflictResolver;
//# sourceMappingURL=conflict-resolver.js.map