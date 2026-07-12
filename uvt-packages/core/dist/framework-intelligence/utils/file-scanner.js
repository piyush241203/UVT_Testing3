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
exports.FastFileScanner = void 0;
const fs = __importStar(require("fs"));
const fast_glob_1 = __importDefault(require("fast-glob"));
class FastFileScanner {
    static async scan(cwd) {
        // Ultra-fast scanner that only looks for typical source files, ignoring deep nested folders.
        // It restricts depth to keep under the 3-second limit for massive monorepos.
        return await (0, fast_glob_1.default)([
            'src/**/*.{ts,tsx,js,jsx,vue,svelte,astro}',
            'app/**/*.{ts,tsx,js,jsx,vue,svelte,astro}',
            'pages/**/*.{ts,tsx,js,jsx,vue,svelte,astro}',
            'components/**/*.{ts,tsx,js,jsx,vue,svelte,astro}'
        ], {
            cwd,
            absolute: true,
            ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**', '**/.uvt/**'],
            onlyFiles: true,
            deep: 4
        });
    }
    static async readFilesContent(files, limit = 200) {
        const subset = files.slice(0, limit); // Don't parse all 100,000 files in a monorepo!
        const results = [];
        for (const f of subset) {
            try {
                const content = fs.readFileSync(f, 'utf8');
                results.push({ path: f, content });
            }
            catch (e) {
                // ignore read errors
            }
        }
        return results;
    }
}
exports.FastFileScanner = FastFileScanner;
//# sourceMappingURL=file-scanner.js.map