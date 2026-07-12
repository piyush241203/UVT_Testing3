"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSignalStore = exports.DefaultSignalCollection = void 0;
/**
 * Basic implementation of SignalCollection
 */
class DefaultSignalCollection {
    signals = new Map();
    add(signal) {
        this.signals.set(signal.id, signal);
    }
    remove(id) {
        this.signals.delete(id);
    }
    merge(collection) {
        collection.toArray().forEach(sig => this.signals.set(sig.id, sig));
    }
    filterByCategory(category) {
        const subset = new DefaultSignalCollection();
        this.toArray().filter(s => s.category === category).forEach(s => subset.add(s));
        return subset;
    }
    filterBySeverity(minSeverity) {
        // Basic severity ranking logic could go here. For now it returns everything matching.
        const subset = new DefaultSignalCollection();
        this.toArray().filter(s => s.severity === minSeverity).forEach(s => subset.add(s));
        return subset;
    }
    query(predicate) {
        return this.toArray().filter(predicate);
    }
    toArray() {
        return Array.from(this.signals.values());
    }
    count() {
        return this.signals.size;
    }
    clone() {
        const cloned = new DefaultSignalCollection();
        this.toArray().forEach(sig => cloned.add(sig));
        return cloned;
    }
    serialize() {
        return JSON.stringify(this.toArray());
    }
    deserialize(data) {
        const parsed = JSON.parse(data);
        parsed.forEach(sig => this.add(sig));
    }
}
exports.DefaultSignalCollection = DefaultSignalCollection;
class DefaultSignalStore {
    collection = new DefaultSignalCollection();
    history = [];
    getCollection() {
        return this.collection;
    }
    lookup(id) {
        return this.collection.query(s => s.id === id)[0];
    }
    push(signal) {
        this.collection.add(signal);
        this.history.push(signal);
    }
    getHistory() {
        return [...this.history];
    }
    clear() {
        this.collection = new DefaultSignalCollection();
        this.history = [];
    }
}
exports.DefaultSignalStore = DefaultSignalStore;
//# sourceMappingURL=store.js.map