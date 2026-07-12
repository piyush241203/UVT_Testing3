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
exports.DependencyParser = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const shared_1 = require("@uvt/shared");
class DependencyParser {
    static async createContext(cwd) {
        const packageJsonPath = path.join(cwd, 'package.json');
        let packageJson = {};
        let dependencies = {};
        if (fs.existsSync(packageJsonPath)) {
            try {
                packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                dependencies = {
                    ...(packageJson.dependencies || {}),
                    ...(packageJson.devDependencies || {})
                };
            }
            catch (e) {
                shared_1.logger.warn(`RIE: Failed to parse package.json: ${e.message}`);
            }
        }
        // Only glob configuration files, lockfiles, and top level indicators to stay under 2 seconds.
        // Avoid deep traversal of src/ unless looking for specific framework entrypoints.
        const files = await (0, fast_glob_1.default)([
            '*.json', '*.js', '*.ts', '*.mjs', '*.cjs',
            'src/**/*.{ts,tsx,js,jsx,vue,svelte}',
            'app/**/*.{ts,tsx,js,jsx}',
            'pages/**/*.{ts,tsx,js,jsx}'
        ], {
            cwd,
            absolute: false,
            ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**', '**/.uvt/**'],
            onlyFiles: true,
            deep: 4 // restrict depth to stay incredibly fast
        });
        return {
            cwd,
            packageJson,
            dependencies,
            files,
            capabilities: new Map(),
            logger: shared_1.logger
        };
    }
}
exports.DependencyParser = DependencyParser;
//# sourceMappingURL=parser.js.map