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
exports.FaultInjector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FaultInjector {
    static injectFault(targetDir, id) {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        switch (id) {
            case 'broken_package_json':
                fs.writeFileSync(path.join(targetDir, 'package.json'), '{ name: "broken", syntax_error: }', 'utf8');
                break;
            case 'broken_yaml_config':
                const uvtDir = path.join(targetDir, '.uvt');
                if (!fs.existsSync(uvtDir))
                    fs.mkdirSync(uvtDir, { recursive: true });
                fs.writeFileSync(path.join(uvtDir, 'config.yml'), 'framework: react\n  invalid_indentation: [', 'utf8');
                break;
            case 'missing_config':
                const cfgPath = path.join(targetDir, '.uvt', 'config.yml');
                if (fs.existsSync(cfgPath))
                    fs.unlinkSync(cfgPath);
                break;
            case 'missing_lockfile':
                const locks = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'];
                for (const l of locks) {
                    const lPath = path.join(targetDir, l);
                    if (fs.existsSync(lPath))
                        fs.unlinkSync(lPath);
                }
                break;
            case 'broken_tsconfig':
                fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), '{ "compilerOptions": { "module": } }', 'utf8');
                break;
            case 'wrong_port':
                const pkgWrongPort = { name: 'app', scripts: { dev: 'vite --port 999999' } };
                fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgWrongPort, null, 2), 'utf8');
                break;
            case 'broken_scripts':
                const pkgBrokenScript = { name: 'app', scripts: { dev: 'non_existent_command_xyz' } };
                fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgBrokenScript, null, 2), 'utf8');
                break;
            case 'missing_dependencies':
                const nodeModules = path.join(targetDir, 'node_modules');
                if (fs.existsSync(nodeModules)) {
                    fs.rmSync(nodeModules, { recursive: true, force: true });
                }
                break;
            case 'corrupted_workflow':
                const ghaDir = path.join(targetDir, '.github', 'workflows');
                if (!fs.existsSync(ghaDir))
                    fs.mkdirSync(ghaDir, { recursive: true });
                fs.writeFileSync(path.join(ghaDir, 'uvt.yml'), 'name: UVT\non: [push\n  jobs: invalid:', 'utf8');
                break;
        }
    }
}
exports.FaultInjector = FaultInjector;
//# sourceMappingURL=fault-injector.js.map