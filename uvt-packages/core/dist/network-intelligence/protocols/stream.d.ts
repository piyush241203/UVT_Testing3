import { ProtocolHandler } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
export declare class StreamProtocol implements ProtocolHandler {
    readonly name = "Stream";
    supports(url: string, headers: Record<string, string>): boolean;
    analyzeRequest(url: string, method: string, headers: Record<string, string>, postData?: string): void;
    analyzeResponse(url: string, method: string, headers: Record<string, string>, payload?: any): DynamicSignal[];
}
//# sourceMappingURL=stream.d.ts.map