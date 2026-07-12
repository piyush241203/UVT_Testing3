"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SNIEDoctor = void 0;
class SNIEDoctor {
    static printDiagnostics(metadata) {
        console.log(`\nSemantic Network Intelligence Report`);
        console.log(`====================================`);
        console.log(`Intercepted Endpoints: ${metadata.endpoints.length}`);
        console.log(`Detected Protocols:    ${metadata.detectedProtocols.join(', ') || 'None'}`);
        console.log(`Dynamic Fields Found:  ${metadata.dynamicFieldsCount}`);
        console.log(`Auth Mechanisms:       ${metadata.hasAuthentication ? 'Yes' : 'No'}`);
        console.log(`Realtime Streams:      ${metadata.hasRealtime ? 'Yes' : 'No'}`);
        console.log(`\nRecommendations:`);
        if (metadata.hasAuthentication)
            console.log(' - Enable Authentication Stabilizer (Tokens detected)');
        if (metadata.hasRealtime)
            console.log(' - Enable Realtime Mocker (WebSocket/SSE detected)');
        if (metadata.dynamicFieldsCount > 0)
            console.log(` - Enable Payload Mocking (${metadata.dynamicFieldsCount} dynamic fields discovered)`);
        if (!metadata.hasAuthentication && !metadata.hasRealtime && metadata.dynamicFieldsCount === 0) {
            console.log(' - Network payloads appear completely stable (No recommendations).');
        }
        console.log();
    }
}
exports.SNIEDoctor = SNIEDoctor;
//# sourceMappingURL=snie-doctor.js.map