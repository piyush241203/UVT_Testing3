import { ConflictPolicy } from '../models/models.js';
export declare class ConflictResolver {
    private policy;
    constructor(policy?: ConflictPolicy);
    resolve(localArtifact: any, remoteArtifact: any): any;
}
//# sourceMappingURL=conflict-resolver.d.ts.map