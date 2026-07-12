"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeDetector = void 0;
class RealtimeDetector {
    name = 'RealtimeDetector';
    async detect(context) {
        const deps = context.dependencies;
        let realtime = 'None';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Socket.io', dep: 'socket.io-client' },
            { name: 'Pusher', dep: 'pusher-js' },
            { name: 'Ably', dep: 'ably' },
            { name: 'SignalR', dep: '@microsoft/signalr' },
            { name: 'Firebase Realtime DB', dep: 'firebase' },
            { name: 'Supabase Realtime', dep: '@supabase/supabase-js' }
        ];
        for (const check of checks) {
            if (deps[check.dep]) {
                realtime = check.name;
                confidence = 0.9;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('realtime', {
            id: 'realtime',
            type: 'realtime',
            name: realtime,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.RealtimeDetector = RealtimeDetector;
//# sourceMappingURL=detector.js.map