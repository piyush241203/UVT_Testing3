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
exports.scanProject = scanProject;
const index_js_1 = require("../repository-intelligence/index.js");
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
async function scanProject(context, frameworkDetails) {
    const engine = new index_js_1.RepositoryIntelligenceEngine(context.cwd);
    const rie = await engine.scan(context.cwd);
    const deps = context.dependencies;
    // Use RIE for styling
    const stylingEngine = rie.metadata.styling !== 'None' && rie.metadata.styling !== 'Vanilla CSS'
        ? rie.metadata.styling
        : (deps['tailwindcss'] ? 'Tailwind CSS' : (deps['styled-components'] ? 'Styled Components' : 'CSS Modules'));
    // Legacy fast counts
    let pagesCount = 3;
    let componentsCount = 8;
    try {
        const pagesFiles = await (0, fast_glob_1.default)('**/*.{js,jsx,ts,tsx,vue,svelte}', { cwd: path.join(context.cwd, 'src', 'pages') });
        if (pagesFiles.length > 0)
            pagesCount = pagesFiles.length;
        const appFiles = await (0, fast_glob_1.default)('**/page.{js,jsx,ts,tsx}', { cwd: path.join(context.cwd, 'src', 'app') });
        if (appFiles.length > 0)
            pagesCount = appFiles.length;
        const compFiles = await (0, fast_glob_1.default)('{src,app,components}/**/*.{jsx,tsx,vue,svelte}', { cwd: context.cwd });
        if (compFiles.length > pagesCount)
            componentsCount = compFiles.length - pagesCount;
    }
    catch { }
    let apisCount = 3;
    let dynamicWidgetsCount = 2;
    return {
        framework: frameworkDetails.name,
        frameworkConfidence: frameworkDetails.confidence,
        frameworkEvidence: frameworkDetails.evidence,
        stylingEngine,
        pagesCount,
        componentsCount,
        apisCount,
        dynamicWidgetsCount,
        percyConfigured: !!process.env.PERCY_TOKEN || deps['@percy/cli'] !== undefined,
        playwrightConfigured: deps['playwright'] !== undefined || deps['@playwright/test'] !== undefined
    };
}
//# sourceMappingURL=project-scanner.js.map