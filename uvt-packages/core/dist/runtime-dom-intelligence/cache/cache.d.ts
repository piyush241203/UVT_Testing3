import { DOMMetadata } from '../models/models.js';
export declare class RDIECache {
    private cache;
    getFingerprint(url: string, rawJson: string): string;
    get(fingerprint: string): DOMMetadata | null;
    set(fingerprint: string, metadata: DOMMetadata): void;
    has(fingerprint: string): boolean;
    clear(): void;
}
//# sourceMappingURL=cache.d.ts.map