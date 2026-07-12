"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPOSITORY_MATRIX = void 0;
exports.REPOSITORY_MATRIX = [
    {
        id: 'react-heavy',
        name: 'React SPA with Material UI',
        framework: 'React',
        libraries: ['Material UI', 'React Query'],
        mockTelemetry: {
            accuracy: 99,
            stabilizationSuccess: 98,
            falsePositiveRate: 1,
            executionTimeMs: 1200,
            memoryUsageMb: 140
        }
    },
    {
        id: 'next-ssr',
        name: 'Next.js App Router',
        framework: 'Next.js',
        libraries: ['Tailwind CSS', 'shadcn/ui'],
        mockTelemetry: {
            accuracy: 98,
            stabilizationSuccess: 97,
            falsePositiveRate: 2,
            executionTimeMs: 1500,
            memoryUsageMb: 160
        }
    },
    {
        id: 'vue-dashboard',
        name: 'Vue 3 Admin Dashboard',
        framework: 'Vue',
        libraries: ['Pinia', 'ECharts'],
        mockTelemetry: {
            accuracy: 100,
            stabilizationSuccess: 99,
            falsePositiveRate: 0.5,
            executionTimeMs: 1100,
            memoryUsageMb: 120
        }
    },
    {
        id: 'angular-enterprise',
        name: 'Angular Enterprise App',
        framework: 'Angular',
        libraries: ['NgRx', 'Angular Material'],
        mockTelemetry: {
            accuracy: 97,
            stabilizationSuccess: 95,
            falsePositiveRate: 3,
            executionTimeMs: 1800,
            memoryUsageMb: 200
        }
    },
    {
        id: 'astro-static',
        name: 'Astro Content Site',
        framework: 'Astro',
        libraries: ['React', 'Solid'],
        mockTelemetry: {
            accuracy: 95,
            stabilizationSuccess: 96,
            falsePositiveRate: 1,
            executionTimeMs: 800,
            memoryUsageMb: 90
        }
    }
];
//# sourceMappingURL=matrix.js.map