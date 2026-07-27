"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationReporter = void 0;
class CertificationReporter {
    compileSuiteSummary(reports) {
        const totalRepositories = reports.length;
        const passedRepositories = reports.filter(r => r.passed).length;
        const failedRepositories = totalRepositories - passedRepositories;
        const repositoryScore = totalRepositories > 0
            ? Math.round((passedRepositories / totalRepositories) * 100)
            : 0;
        const frameworkMap = new Map();
        for (const rep of reports) {
            const list = frameworkMap.get(rep.framework) || [];
            list.push(rep);
            frameworkMap.set(rep.framework, list);
        }
        const frameworkScores = [];
        for (const [framework, fwReports] of frameworkMap.entries()) {
            const fwPassed = fwReports.filter(r => r.passed).length;
            const fwAvg = Math.round(fwReports.reduce((acc, r) => acc + r.score, 0) / fwReports.length);
            frameworkScores.push({
                framework,
                repositoryCount: fwReports.length,
                passedCount: fwPassed,
                averageScore: fwAvg,
                status: fwAvg >= 80 ? 'CERTIFIED' : 'FAILED'
            });
        }
        const frameworkScore = frameworkScores.length > 0
            ? Math.round(frameworkScores.reduce((acc, f) => acc + f.averageScore, 0) / frameworkScores.length)
            : 0;
        const automationScore = Math.round(reports.reduce((acc, r) => acc + r.score, 0) / (reports.length || 1));
        const overallScore = Math.round((repositoryScore * 0.4) + (frameworkScore * 0.3) + (automationScore * 0.3));
        return {
            totalRepositories,
            passedRepositories,
            failedRepositories,
            overallScore,
            repositoryScore,
            frameworkScore,
            automationScore,
            frameworkScores,
            reports,
            timestamp: Date.now()
        };
    }
}
exports.CertificationReporter = CertificationReporter;
//# sourceMappingURL=reporter.js.map