import { Page } from 'playwright';
import { ProtocolHandler, EndpointSchema } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
import { SNIECache } from '../cache/cache.js';
export declare class PlaywrightInterceptor {
    private page;
    private protocols;
    private cache;
    private onSignal;
    private onSchema;
    constructor(page: Page, protocols: ProtocolHandler[], cache: SNIECache, onSignal: (signal: DynamicSignal) => void, onSchema: (schema: EndpointSchema) => void);
    attach(): void;
    detach(): void;
    private handleRequest;
    private handleResponse;
}
//# sourceMappingURL=playwright-interceptor.d.ts.map