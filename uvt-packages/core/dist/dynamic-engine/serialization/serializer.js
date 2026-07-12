"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSignalSerializer = void 0;
const store_js_1 = require("../models/signal/store.js");
class JSONSignalSerializer {
    serializeSignal(signal) {
        return JSON.stringify(signal);
    }
    deserializeSignal(data) {
        return JSON.parse(data);
    }
    serializeCollection(collection) {
        return collection.serialize();
    }
    deserializeCollection(data) {
        const col = new store_js_1.DefaultSignalCollection();
        col.deserialize(data);
        return col;
    }
}
exports.JSONSignalSerializer = JSONSignalSerializer;
//# sourceMappingURL=serializer.js.map