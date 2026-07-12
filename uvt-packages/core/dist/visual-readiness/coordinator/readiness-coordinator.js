"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadinessCoordinator = void 0;
class ReadinessCoordinator {
    config;
    conditions;
    constructor(config, conditions) {
        this.config = config;
        this.conditions = conditions;
        this.conditions.sort((a, b) => b.priority() - a.priority());
    }
    async waitForReadiness(page) {
        const startTime = Date.now();
        if (!this.config.enabled) {
            return { ready: true, reason: 'Readiness disabled', confidence: 1, remainingConditions: [], duration: 0 };
        }
        try {
            await Promise.all(this.conditions.map(c => c.initialize(page)));
            while (Date.now() - startTime < this.config.maxWait) {
                const remaining = [];
                for (const condition of this.conditions) {
                    const isReady = await condition.check();
                    if (!isReady) {
                        remaining.push(condition.id);
                    }
                }
                if (remaining.length === 0) {
                    return {
                        ready: true,
                        reason: 'All conditions met',
                        confidence: 1,
                        remainingConditions: [],
                        duration: Date.now() - startTime
                    };
                }
                // Wait a bit before checking again
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return {
                ready: false,
                reason: 'Timeout reached',
                confidence: 0,
                remainingConditions: this.conditions.map(c => c.id), // simplified
                duration: Date.now() - startTime
            };
        }
        finally {
            this.conditions.forEach(c => c.dispose());
        }
    }
}
exports.ReadinessCoordinator = ReadinessCoordinator;
//# sourceMappingURL=readiness-coordinator.js.map