import { DynamicSignal } from './signal.js';
import { SignalCategory, SignalSeverity } from '../../classification/enums.js';
export interface SignalCollection {
    /** Add a new signal. Since signals are immutable, this could return a new collection or modify internal state. */
    add(signal: DynamicSignal): void;
    /** Remove a signal by id */
    remove(id: string): void;
    /** Merge another collection into this one */
    merge(collection: SignalCollection): void;
    /** Filter signals by category */
    filterByCategory(category: SignalCategory): SignalCollection;
    /** Filter signals by minimum severity */
    filterBySeverity(minSeverity: SignalSeverity): SignalCollection;
    /** Query using a custom predicate */
    query(predicate: (signal: DynamicSignal) => boolean): DynamicSignal[];
    /** Return all signals as an array */
    toArray(): DynamicSignal[];
    /** Get total count */
    count(): number;
    /** Create a deep clone of the collection */
    clone(): SignalCollection;
    /** Serialize to a string or generic format */
    serialize(): string;
    /** Deserialize from string */
    deserialize(data: string): void;
}
//# sourceMappingURL=collection.d.ts.map