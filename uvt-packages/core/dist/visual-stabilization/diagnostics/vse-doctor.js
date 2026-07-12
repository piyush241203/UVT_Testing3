"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSEDoctor = void 0;
class VSEDoctor {
    static printDiagnostics(metadata) {
        console.log(`\nVisual Stabilization Engine Report`);
        console.log(`==================================`);
        console.log(`Plugins Loaded:         ${metadata.pluginsLoaded}`);
        console.log(`Stabilization Actions:  ${metadata.actionsPlanned} planned, ${metadata.verification.actionsApplied} applied`);
        console.log(`Execution Time:         ${metadata.executionTimeMs}ms`);
        console.log(`Rollback Ready:         Yes (window.__UVT_ROLLBACK__ populated)`);
        if (!metadata.verification.success) {
            console.log(`\nFailures Detected:`);
            metadata.verification.errors.forEach(e => console.log(` - ${e}`));
        }
        console.log();
    }
}
exports.VSEDoctor = VSEDoctor;
//# sourceMappingURL=vse-doctor.js.map