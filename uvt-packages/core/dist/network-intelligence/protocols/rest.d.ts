import { ProtocolHandler } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
export declare class RestProtocol implements ProtocolHandler {
    readonly name = "REST";
    supports(url: string, headers: Record<string, string>): boolean;
    analyzeRequest(url: string, method: string, headers: Record<string, string>, postData?: string): void;
    analyzeResponse(url: string, method: string, headers: Record<string, string>, payload?: any): DynamicSignal[];
}
//# sourceMappingURL=rest.d.ts.map