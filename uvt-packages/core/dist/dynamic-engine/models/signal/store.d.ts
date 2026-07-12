import { DynamicSignal } from './signal.js';
import { SignalCollection } from './collection.js';
/**
 * Basic implementation of SignalCollection
 */
export declare class DefaultSignalCollection implements SignalCollection {
    private signals;
    add(signal: DynamicSignal): void;
    remove(id: string): void;
    merge(collection: SignalCollection): void;
    filterByCategory(category: string): SignalCollection;
    filterBySeverity(minSeverity: string): SignalCollection;
    query(predicate: (signal: DynamicSignal) => boolean): DynamicSignal[];
    toArray(): DynamicSignal[];
    count(): number;
    clone(): SignalCollection;
    serialize(): string;
    deserialize(data: string): void;
}
/**
 * Centralized Store for managing signals over time, history tracking, and lookup
 */
export interface SignalStore {
    /** Maintain the immutable master collection */
    getCollection(): SignalCollection;
    /** Retrieve a signal by exact ID */
    lookup(id: string): DynamicSignal | undefined;
    /** Push a new signal into the store (indexing it) */
    push(signal: DynamicSignal): void;
    /** Retrieve history of signals over time */
    getHistory(): DynamicSignal[];
    /** Clear the store */
    clear(): void;
}
export declare class DefaultSignalStore implements SignalStore {
    private collection;
    private history;
    getCollection(): SignalCollection;
    lookup(id: string): DynamicSignal | undefined;
    push(signal: DynamicSignal): void;
    getHistory(): DynamicSignal[];
    clear(): void;
}
//# sourceMappingURL=store.d.ts.map