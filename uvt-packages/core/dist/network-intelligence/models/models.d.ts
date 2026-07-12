import { DynamicSignal, SignalConfidence } from '../../dynamic-engine/index.js';
export interface FieldClassification {
    category: 'Identity' | 'Time' | 'Authentication' | 'Session' | 'Security' | 'Version' | 'Transaction' | 'Resource' | 'Business' | 'Metadata' | 'Custom';
    confidence: SignalConfidence;
    reason: string;
    recommendation?: string;
    isDynamic: boolean;
}
export interface EndpointSchema {
    url: string;
    method: string;
    signature: string;
    responseSchema: Record<string, string>;
    dynamicFields: Record<string, FieldClassification>;
    protocol: 'rest' | 'graphql' | 'websocket' | 'stream' | 'grpc';
}
export interface NetworkMetadata {
    endpoints: EndpointSchema[];
    detectedProtocols: string[];
    dynamicFieldsCount: number;
    hasAuthentication: boolean;
    hasRealtime: boolean;
}
export interface ProtocolHandler {
    readonly name: string;
    supports(url: string, headers: Record<string, string>): boolean;
    analyzeRequest(url: string, method: string, headers: Record<string, string>, postData?: string): void;
    analyzeResponse(url: string, method: string, headers: Record<string, string>, payload?: any): DynamicSignal[];
}
//# sourceMappingURL=models.d.ts.map