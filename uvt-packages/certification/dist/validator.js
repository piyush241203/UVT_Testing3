"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoValidator = void 0;
class RepoValidator {
    validateRepository(meta, actualAnalysis) {
        const items = [];
        // Item 1: Framework Detection
        const fwPassed = actualAnalysis.frameworkDetected.toLowerCase() === meta.expectedFramework.toLowerCase();
        items.push({
            name: 'Framework Detection',
            passed: fwPassed,
            expected: meta.expectedFramework,
            actual: actualAnalysis.frameworkDetected,
            score: fwPassed ? 100 : 0
        });
        // Item 2: Build Tool Detection
        const buildPassed = actualAnalysis.buildToolDetected.toLowerCase().includes(meta.expectedBuildTool.toLowerCase()) || fwPassed;
        items.push({
            name: 'Build Tool Detection',
            passed: buildPassed,
            expected: meta.expectedBuildTool,
            actual: actualAnalysis.buildToolDetected,
            score: buildPassed ? 100 : 50
        });
        // Item 3: Routing Strategy Detection
        const routingPassed = actualAnalysis.routingDetected.toLowerCase().includes(meta.expectedRouting.toLowerCase()) || fwPassed;
        items.push({
            name: 'Routing Strategy Detection',
            passed: routingPassed,
            expected: meta.expectedRouting,
            actual: actualAnalysis.routingDetected,
            score: routingPassed ? 100 : 50
        });
        // Item 4: Route Discovery Count (allowing margin tolerance)
        const routeMarginPassed = actualAnalysis.routeCountDetected >= Math.floor(meta.expectedRouteCount * 0.5);
        items.push({
            name: 'Route Discovery Count',
            passed: routeMarginPassed,
            expected: meta.expectedRouteCount,
            actual: actualAnalysis.routeCountDetected,
            score: routeMarginPassed ? 100 : 50
        });
        // Item 5: Generated Artifacts (uvt.config.ts & CI Workflows)
        const artifactPassed = actualAnalysis.configArtifactGenerated && actualAnalysis.workflowArtifactGenerated;
        items.push({
            name: 'Artifact Generation',
            passed: artifactPassed,
            expected: 'uvt.config.ts + workflow.yml',
            actual: artifactPassed ? 'Generated' : 'Missing',
            score: artifactPassed ? 100 : 0
        });
        const totalScore = Math.round(items.reduce((acc, i) => acc + i.score, 0) / items.length);
        const overallPassed = items.every(i => i.passed);
        return {
            repoId: meta.id,
            repoName: meta.name,
            framework: meta.framework,
            passed: overallPassed,
            score: totalScore,
            items,
            timestamp: Date.now()
        };
    }
}
exports.RepoValidator = RepoValidator;
//# sourceMappingURL=validator.js.map