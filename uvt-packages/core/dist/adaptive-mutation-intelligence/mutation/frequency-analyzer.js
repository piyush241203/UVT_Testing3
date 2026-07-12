"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrequencyAnalyzer = void 0;
class FrequencyAnalyzer {
    static analyze(timeline) {
        const stats = {};
        for (const event of timeline.events) {
            if (!event.targetSelector)
                continue;
            if (!stats[event.targetSelector]) {
                stats[event.targetSelector] = {
                    selector: event.targetSelector,
                    tag: event.targetTag,
                    count: 0,
                    firstTimestamp: event.timestamp,
                    lastTimestamp: event.timestamp,
                    avgInterval: 0,
                    types: new Set()
                };
            }
            const stat = stats[event.targetSelector];
            stat.count++;
            stat.lastTimestamp = event.timestamp;
            stat.types.add(event.type);
            if (stat.count > 1) {
                stat.avgInterval = (stat.lastTimestamp - stat.firstTimestamp) / (stat.count - 1);
            }
        }
        return stats;
    }
}
exports.FrequencyAnalyzer = FrequencyAnalyzer;
//# sourceMappingURL=frequency-analyzer.js.map