import { MutationMetadata } from '../models/models.js';
export declare class AMIECache {
    private cache;
    getFingerprint(url: string, layoutHash: string): string;
    get(fingerprint: string): MutationMetadata | null;
    set(fingerprint: string, metadata: MutationMetadata): void;
    has(fingerprint: string): boolean;
    clear(): void;
}
//# sourceMappingURL=cache.d.ts.map