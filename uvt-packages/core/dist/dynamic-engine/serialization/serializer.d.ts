import { DynamicSignal } from '../models/signal/signal.js';
import { SignalCollection } from '../models/signal/collection.js';
export interface SignalSerializer {
    serializeSignal(signal: DynamicSignal): string;
    deserializeSignal(data: string): DynamicSignal;
    serializeCollection(collection: SignalCollection): string;
    deserializeCollection(data: string): SignalCollection;
    serializeToBinary?(collection: SignalCollection): Uint8Array;
    deserializeFromBinary?(data: Uint8Array): SignalCollection;
}
export declare class JSONSignalSerializer implements SignalSerializer {
    serializeSignal(signal: DynamicSignal): string;
    deserializeSignal(data: string): DynamicSignal;
    serializeCollection(collection: SignalCollection): string;
    deserializeCollection(data: string): SignalCollection;
}
//# sourceMappingURL=serializer.d.ts.map