"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMIEDoctor = void 0;
class AMIEDoctor {
    static printDiagnostics(metadata) {
        console.log(`\nAdaptive Mutation Intelligence Report`);
        console.log(`=====================================`);
        console.log(`Observation Time:       ${Math.round(metadata.timeline.endTime - metadata.timeline.startTime)}ms`);
        console.log(`Achieved Stability:     ${metadata.isStable ? 'Yes' : 'No'}`);
        console.log(`Total Mutations:        ${metadata.timeline.totalMutations}`);
        const nodes = Object.values(metadata.statistics);
        console.log(`Highly Dynamic Regions: ${nodes.filter(n => n.count > 3).length}`);
        console.log(`\nRecommendations:`);
        const timers = nodes.filter(n => n.avgInterval >= 900 && n.avgInterval <= 1100);
        if (timers.length > 0) {
            console.log(` - Enable Time Stabilizer (${timers.length} timer patterns detected).`);
        }
        const animations = nodes.filter(n => n.avgInterval > 0 && n.avgInterval < 100);
        if (animations.length > 0) {
            console.log(` - Enable Animation Stabilizer (${animations.length} high-frequency layout shifts detected).`);
        }
        if (timers.length === 0 && animations.length === 0 && metadata.isStable) {
            console.log(' - Page is completely static (No recommendations).');
        }
        console.log();
    }
}
exports.AMIEDoctor = AMIEDoctor;
//# sourceMappingURL=amie-doctor.js.map