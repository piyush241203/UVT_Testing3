"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapsDetector = void 0;
class MapsDetector {
    name = 'MapsDetector';
    async detect(context) {
        const deps = context.dependencies;
        let maps = 'None';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Google Maps', dep: '@react-google-maps/api' },
            { name: 'Google Maps', dep: 'google-map-react' },
            { name: 'Mapbox', dep: 'mapbox-gl' },
            { name: 'Mapbox', dep: 'react-map-gl' },
            { name: 'Leaflet', dep: 'leaflet' },
            { name: 'Leaflet', dep: 'react-leaflet' },
            { name: 'OpenLayers', dep: 'ol' },
            { name: 'Here Maps', dep: '@here/maps-api-for-javascript' }
        ];
        for (const check of checks) {
            if (deps[check.dep]) {
                maps = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('maps', {
            id: 'maps',
            type: 'maps',
            name: maps,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.MapsDetector = MapsDetector;
//# sourceMappingURL=detector.js.map