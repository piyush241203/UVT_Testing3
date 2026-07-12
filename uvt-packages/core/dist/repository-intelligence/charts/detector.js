"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsDetector = void 0;
class ChartsDetector {
    name = 'ChartsDetector';
    async detect(context) {
        const deps = context.dependencies;
        let charts = 'None';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Chart.js', dep: 'chart.js' },
            { name: 'Recharts', dep: 'recharts' },
            { name: 'ECharts', dep: 'echarts' },
            { name: 'Highcharts', dep: 'highcharts' },
            { name: 'Victory', dep: 'victory' },
            { name: 'Nivo', dep: '@nivo/core' },
            { name: 'ApexCharts', dep: 'apexcharts' },
            { name: 'Plotly', dep: 'plotly.js' },
            { name: 'D3', dep: 'd3' }
        ];
        for (const check of checks) {
            if (deps[check.dep] || (check.dep === 'chart.js' && deps['react-chartjs-2'])) {
                charts = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('charts', {
            id: 'charts',
            type: 'charts',
            name: charts,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.ChartsDetector = ChartsDetector;
//# sourceMappingURL=detector.js.map