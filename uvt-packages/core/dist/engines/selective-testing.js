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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAffectedRoutes = getAffectedRoutes;
const simple_git_1 = __importDefault(require("simple-git"));
const madge_1 = __importDefault(require("madge"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const shared_1 = require("@uvt/shared");
function findGitRoot(startDir) {
    let dir = startDir;
    while (true) {
        if (fs.existsSync(path.join(dir, '.git'))) {
            return dir;
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
            break;
        }
        dir = parent;
    }
    return null;
}
async function getAffectedRoutes(cwd, routes) {
    const gitRoot = findGitRoot(cwd);
    if (!gitRoot) {
        shared_1.logger.warn('Workspace is not inside a git repository. Running all tests.');
        return { affectedRoutes: routes, changedFiles: [] };
    }
    const git = (0, simple_git_1.default)(gitRoot);
    let changedFiles = [];
    // 1. Get changed files from Git
    try {
        let baseRef = '';
        if (process.env.GITHUB_EVENT_NAME === 'pull_request' && process.env.GITHUB_BASE_REF) {
            baseRef = `origin/${process.env.GITHUB_BASE_REF}`;
            shared_1.logger.info(`CI Pull Request detected. Comparing against base: ${baseRef}`);
        }
        else if (process.env.GITHUB_ACTIONS === 'true') {
            baseRef = 'HEAD~1';
            shared_1.logger.info(`CI Push/Workflow detected. Comparing against previous commit: ${baseRef}`);
        }
        else {
            // Local development base detection
            try {
                await git.revparse(['--verify', 'origin/main']);
                baseRef = 'origin/main';
            }
            catch {
                try {
                    await git.revparse(['--verify', 'main']);
                    baseRef = 'main';
                }
                catch {
                    baseRef = 'HEAD~1';
                }
            }
            shared_1.logger.info(`Local environment detected. Comparing against base ref: ${baseRef}`);
        }
        // Verify if baseRef exists in history
        try {
            await git.revparse(['--verify', baseRef]);
        }
        catch {
            shared_1.logger.debug(`Git ref "${baseRef}" not found. Trying fallback to HEAD~1 or HEAD.`);
            try {
                await git.revparse(['--verify', 'HEAD~1']);
                baseRef = 'HEAD~1';
            }
            catch {
                baseRef = 'HEAD';
            }
        }
        const diffFiles = await git.diff(['--name-only', baseRef]);
        const status = (await git.status());
        const untrackedFiles = status.not_tracked || [];
        const modifiedUncommitted = [
            ...(status.modified || []),
            ...(status.created || []),
            ...(status.deleted || []),
            ...(status.renamed || []).map((r) => typeof r === 'string' ? r : r.to || r.from)
        ];
        const allDiffs = new Set([
            ...diffFiles.split('\n').map(f => f.trim()),
            ...untrackedFiles,
            ...modifiedUncommitted
        ]);
        changedFiles = Array.from(allDiffs)
            .filter(f => f.length > 0)
            .map(f => path.resolve(gitRoot, f));
        shared_1.logger.info(`Git Diff detected ${changedFiles.length} modified files.`);
        changedFiles.forEach(f => shared_1.logger.debug(`  - Modified: ${f}`));
    }
    catch (err) {
        shared_1.logger.warn(`Failed to execute git commands: ${err.message}. Running all tests.`);
        return { affectedRoutes: routes, changedFiles: [] };
    }
    if (changedFiles.length === 0) {
        shared_1.logger.info('No changes detected in repository. Skipping all selective tests.');
        return { affectedRoutes: [], changedFiles: [] };
    }
    // 2. Build import dependency graph using madge
    let srcDir = path.join(cwd, 'src');
    if (!fs.existsSync(srcDir)) {
        const rootApp = path.join(cwd, 'app');
        const rootPages = path.join(cwd, 'pages');
        if (fs.existsSync(rootApp)) {
            srcDir = rootApp;
        }
        else if (fs.existsSync(rootPages)) {
            srcDir = rootPages;
        }
        else {
            srcDir = cwd; // Fallback for plain PHP and frameworks without src/
        }
    }
    let graph = {};
    try {
        // Madge will build the dependency tree of JS/TS/JSX/TSX files
        const madgeResult = await (0, madge_1.default)(srcDir, {
            fileExtensions: ['js', 'jsx', 'ts', 'tsx'],
            includeNpm: false,
            excludeRegExp: [/node_modules/, /vendor/, /dist/, /\.git/]
        });
        // Madge returns relative paths from base dir (srcDir)
        // Map them to absolute paths for easy comparison
        const rawGraph = madgeResult.obj();
        Object.keys(rawGraph).forEach(fileKey => {
            const absKey = path.resolve(srcDir, fileKey);
            const absDeps = rawGraph[fileKey].map((dep) => path.resolve(srcDir, dep));
            graph[absKey] = absDeps;
        });
    }
    catch (err) {
        shared_1.logger.warn(`Failed to construct import graph using madge: ${err.message}. Running all tests.`);
        return { affectedRoutes: routes, changedFiles };
    }
    // 3. Trace dependencies recursively
    const affectedRoutes = [];
    const checkedRoutes = new Set();
    // Collect all known files (routes and graph dependencies)
    const knownFiles = new Set();
    routes.forEach(r => {
        if (r.sourceFile)
            knownFiles.add(path.resolve(r.sourceFile));
    });
    Object.keys(graph).forEach(k => {
        knownFiles.add(k);
        graph[k].forEach(d => knownFiles.add(d));
    });
    // Check if there are any source files (.php, .html, .js, .css, etc) changed that are UNKNOWN
    const unmappedChanges = changedFiles.filter(f => {
        if (knownFiles.has(f))
            return false;
        const ext = path.extname(f).toLowerCase();
        return ['.php', '.html', '.css', '.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte'].includes(ext);
    });
    if (unmappedChanges.length > 0) {
        shared_1.logger.info(`Detected changes in shared or unmapped source files (e.g. ${path.basename(unmappedChanges[0])}). Running all tests.`);
        return { affectedRoutes: routes, changedFiles };
    }
    for (const route of routes) {
        if (!route.sourceFile) {
            // If no source file mapped, run it defensively
            affectedRoutes.push(route);
            continue;
        }
        const routeSourceAbs = path.resolve(route.sourceFile);
        if (changedFiles.includes(routeSourceAbs)) {
            affectedRoutes.push(route);
            checkedRoutes.add(route.url);
            continue;
        }
        // Run DFS/BFS trace to see if routeSourceAbs imports any changed file
        const visited = new Set();
        let dependsOnChanged = false;
        const queue = [routeSourceAbs];
        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current))
                continue;
            visited.add(current);
            // Check if current is one of the modified files
            if (changedFiles.includes(current)) {
                dependsOnChanged = true;
                break;
            }
            // Check imports of current file (who current file depends on)
            const deps = graph[current] || [];
            for (const dep of deps) {
                if (!visited.has(dep)) {
                    queue.push(dep);
                }
            }
        }
        if (dependsOnChanged) {
            shared_1.logger.debug(`Route "${route.name}" (${route.url}) is affected by dependency changes.`);
            affectedRoutes.push(route);
            checkedRoutes.add(route.url);
        }
    }
    shared_1.logger.info(`Selective testing identified ${affectedRoutes.length} affected routes out of ${routes.length} total.`);
    return { affectedRoutes, changedFiles };
}
//# sourceMappingURL=selective-testing.js.map