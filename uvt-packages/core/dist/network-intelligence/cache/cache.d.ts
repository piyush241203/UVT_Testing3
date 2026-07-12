import { EndpointSchema } from '../models/models.js';
export declare class SNIECache {
    private memoryCache;
    get(signature: string): EndpointSchema | null;
    set(signature: string, schema: EndpointSchema): void;
    has(signature: string): boolean;
    getAll(): EndpointSchema[];
    clear(): void;
}
//# sourceMappingURL=cache.d.ts.map