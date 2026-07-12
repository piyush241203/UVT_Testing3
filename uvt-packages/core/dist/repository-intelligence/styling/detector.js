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
exports.StylingDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class StylingDetector {
    name = 'StylingDetector';
    async detect(context) {
        const deps = context.dependencies;
        let styling = 'Vanilla CSS';
        let confidence = 0.5;
        const evidence = [];
        const checks = [
            { name: 'Tailwind CSS', dep: 'tailwindcss' },
            { name: 'Bootstrap', dep: 'bootstrap' },
            { name: 'MUI', dep: '@mui/material' },
            { name: 'Chakra UI', dep: '@chakra-ui/react' },
            { name: 'Ant Design', dep: 'antd' },
            { name: 'Bulma', dep: 'bulma' },
            { name: 'Mantine', dep: '@mantine/core' },
            { name: 'Styled Components', dep: 'styled-components' },
            { name: 'Emotion', dep: '@emotion/react' },
            { name: 'SCSS', dep: 'sass' },
            { name: 'LESS', dep: 'less' }
        ];
        for (const check of checks) {
            if (deps[check.dep]) {
                styling = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        if (styling === 'Vanilla CSS') {
            if (fs.existsSync(path.join(context.cwd, 'tailwind.config.js')) || fs.existsSync(path.join(context.cwd, 'tailwind.config.ts'))) {
                styling = 'Tailwind CSS';
                confidence = 0.9;
                evidence.push('Found tailwind config file.');
            }
            else {
                evidence.push('Defaulted to Vanilla CSS.');
            }
        }
        context.capabilities.set('styling', {
            id: 'styling',
            type: 'styling',
            name: styling,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.StylingDetector = StylingDetector;
//# sourceMappingURL=detector.js.map