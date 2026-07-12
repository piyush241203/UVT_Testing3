"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDIEDoctor = void 0;
class RDIEDoctor {
    static printDiagnostics(metadata) {
        console.log(`\nRuntime DOM Intelligence Report`);
        console.log(`===============================`);
        console.log(`Total Nodes Evaluated:  ${metadata.nodeCount}`);
        console.log(`Shadow Roots Detected:  ${metadata.shadowRootCount}`);
        console.log(`Media Nodes (IMG, SVG): ${metadata.mediaCount}`);
        console.log(`\nPotential Dynamic Regions:`);
        if (metadata.shadowRootCount > 0) {
            console.log(' - Shadow DOM boundaries discovered (Verify global CSS penetration).');
        }
        if (metadata.mediaCount > 0) {
            console.log(' - Media elements discovered (Ensure lazy loading is awaited).');
        }
        console.log();
    }
}
exports.RDIEDoctor = RDIEDoctor;
//# sourceMappingURL=rdie-doctor.js.map