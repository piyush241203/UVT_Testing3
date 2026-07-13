"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationRunner = void 0;
/**
 * Framework & Generator Certification Runner — RC-04 URAE Phase 6+7
 *
 * Validates every supported framework demo programmatically:
 * - RIE framework detection accuracy
 * - Route discovery correctness
 * - Generated artifact YAML/JSON validity
 * - GHA workflow structural soundness
 *
 * Run via: `npx uvt certify matrix`
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const shared_1 = require("@uvt/shared");
class CertificationRunner {
    /**
     * Run the full certification matrix across all provided targets.
     */
    static async run(targets) {
        const reports = [];
        for (const target of targets) {
            shared_1.logger.step('CERTIFY', `Certifying: ${target.name} (${target.path})`);
            const report = await CertificationRunner.certifyOne(target);
            reports.push(report);
            const status = report.passed ? '✔ PASSED' : '✗ FAILED';
            const failedChecks = report.checks.filter(c => !c.passed);
            shared_1.logger.info(`${target.name}: ${status} (${report.checks.filter(c => c.passed).length}/${report.checks.length} checks)`);
            if (failedChecks.length > 0) {
                failedChecks.forEach(c => shared_1.logger.warn(`  ✗ ${c.name}: ${c.details}`));
            }
        }
        return reports;
    }
    static async certifyOne(target) {
        const checks = [];
        let detectedFramework = 'Unknown';
        let detectedProjectType = 'Unknown';
        let routeCount = 0;
        if (!fs.existsSync(target.path)) {
            return {
                target: target.name,
                framework: 'Not Found',
                projectType: 'Unknown',
                routeCount: 0,
                checks: [{ name: 'Directory exists', passed: false, details: `Path does not exist: ${target.path}` }],
                passed: false
            };
        }
        // Check 1: Package.json exists
        const pkgPath = path.join(target.path, 'package.json');
        checks.push({
            name: 'package.json exists',
            passed: fs.existsSync(pkgPath),
            details: fs.existsSync(pkgPath) ? 'Found' : 'Missing package.json'
        });
        // Check 2: RIE framework detection
        try {
            const { buildCapabilityGraph } = await import('@uvt/core');
            const graph = await buildCapabilityGraph(target.path);
            detectedFramework = graph.framework.name;
            detectedProjectType = graph.projectType.type;
            const frameworkMatch = graph.framework.pluginName.toLowerCase().includes(target.expectedFramework.toLowerCase()) ||
                target.expectedFramework.toLowerCase().includes(graph.framework.pluginName.toLowerCase()) ||
                graph.framework.name.toLowerCase().includes(target.expectedFramework.toLowerCase());
            checks.push({
                name: 'Framework detection',
                passed: frameworkMatch,
                details: frameworkMatch
                    ? `Detected "${graph.framework.name}" (expected "${target.expectedFramework}") ✔`
                    : `Detected "${graph.framework.name}" but expected "${target.expectedFramework}"`
            });
            checks.push({
                name: 'Project type detection',
                passed: graph.projectType.type === target.expectedProjectType,
                details: `Detected "${graph.projectType.type}" (expected "${target.expectedProjectType}")`
            });
            checks.push({
                name: 'Package manager detection',
                passed: !!graph.packageManager.name,
                details: `Detected: ${graph.packageManager.name} (${graph.packageManager.installCmd})`
            });
            checks.push({
                name: 'Dev server command',
                passed: !!graph.devServer.startCommand,
                details: `Command: ${graph.devServer.startCommand}`
            });
        }
        catch (e) {
            checks.push({ name: 'Framework detection', passed: false, details: `Error: ${e.message}` });
        }
        // Check 3: Route discovery
        try {
            const { CoreEngine } = await import('@uvt/core');
            const engine = new CoreEngine(target.path);
            await engine.initialize();
            const details = await engine.getFrameworkDetails();
            const { createRepoContext } = await import('@uvt/core');
            const context = await createRepoContext(target.path);
            // Dynamic import of plugin registry
            const { pluginRegistry } = await import('@uvt/core');
            const plugin = pluginRegistry.getFramework(details.name);
            if (plugin) {
                const routes = await plugin.discoverRoutes(context);
                routeCount = routes.length;
                checks.push({
                    name: 'Route discovery',
                    passed: routeCount >= target.expectedRouteCount,
                    details: `Discovered ${routeCount} routes (expected ≥ ${target.expectedRouteCount})`
                });
            }
            else {
                checks.push({ name: 'Route discovery', passed: false, details: `No plugin registered for "${details.name}"` });
            }
        }
        catch (e) {
            checks.push({ name: 'Route discovery', passed: false, details: `Error: ${e.message}` });
        }
        // Check 4: GHA workflow exists and is valid
        const workflowPath = path.join(target.path, '.github', 'workflows', 'uvt.yml');
        if (fs.existsSync(workflowPath)) {
            const { ArtifactValidator } = await import('@uvt/core');
            const validationResult = ArtifactValidator.validateYAML(workflowPath);
            checks.push({
                name: 'GHA workflow valid',
                passed: validationResult.valid,
                details: validationResult.valid
                    ? 'Workflow YAML is structurally valid'
                    : `Issues: ${validationResult.errors.map(e => e.message).join('; ')}`
            });
        }
        else {
            checks.push({ name: 'GHA workflow valid', passed: false, details: 'uvt.yml not found' });
        }
        // Check 5: uvt.config.ts exists
        const configPath = path.join(target.path, 'uvt.config.ts');
        checks.push({
            name: 'uvt.config.ts exists',
            passed: fs.existsSync(configPath),
            details: fs.existsSync(configPath) ? 'Found' : 'Missing uvt.config.ts'
        });
        const passed = checks.every(c => c.passed);
        return { target: target.name, framework: detectedFramework, projectType: detectedProjectType, routeCount, checks, passed };
    }
    /**
     * Print a formatted certification matrix table to stdout.
     */
    static printMatrix(reports) {
        console.log('\n');
        console.log('═══════════════════════════════════════════════════════════════════');
        console.log('             UVT FRAMEWORK CERTIFICATION MATRIX (RC-04)           ');
        console.log('═══════════════════════════════════════════════════════════════════');
        for (const r of reports) {
            const status = r.passed ? '✔ PASS' : '✗ FAIL';
            console.log(`\n  ${status}  ${r.target}`);
            console.log(`         Framework   : ${r.framework}`);
            console.log(`         Project Type: ${r.projectType}`);
            console.log(`         Routes      : ${r.routeCount}`);
            for (const c of r.checks) {
                const icon = c.passed ? '    ✔' : '    ✗';
                console.log(`${icon} ${c.name}: ${c.details}`);
            }
        }
        const totalPassed = reports.filter(r => r.passed).length;
        console.log('\n───────────────────────────────────────────────────────────────────');
        console.log(`  Result: ${totalPassed}/${reports.length} frameworks certified`);
        console.log('═══════════════════════════════════════════════════════════════════\n');
    }
}
exports.CertificationRunner = CertificationRunner;
//# sourceMappingURL=certification-runner.js.map