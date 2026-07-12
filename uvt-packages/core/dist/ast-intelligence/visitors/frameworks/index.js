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
exports.AstroVisitor = exports.SvelteVisitor = exports.AngularVisitor = exports.VueVisitor = exports.NextVisitor = exports.ReactVisitor = void 0;
const ts = __importStar(require("typescript"));
const index_js_1 = require("../../../dynamic-engine/index.js");
function emit(context, analyzer, tag, reason) {
    context.emitSignal({
        id: `aie-${tag}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        analyzerId: analyzer,
        analyzerType: 'ast',
        framework: 'unknown',
        category: index_js_1.SignalCategory.FRAMEWORK,
        confidence: 100,
        severity: index_js_1.SignalSeverity.INFO,
        executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
        timestamp: Date.now(),
        reasoning: reason,
        evidence: [{ type: 'ast-node', value: context.filePath }],
        metadata: { file: context.filePath },
        tags: [tag]
    });
}
class ReactVisitor {
    name = 'ReactVisitor';
    visitNode(node, context) {
        if (ts.isCallExpression(node)) {
            const exp = node.expression.getText();
            if (exp === 'useEffect' || exp === 'useLayoutEffect')
                emit(context, this.name, 'USES_EFFECT_HOOK', 'Detected useEffect/useLayoutEffect hook');
            if (exp === 'lazy' || exp === 'React.lazy')
                emit(context, this.name, 'USES_LAZY', 'Detected React.lazy()');
        }
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
            const tagName = ts.isJsxElement(node) ? node.openingElement.tagName.getText() : node.tagName.getText();
            if (tagName === 'Suspense')
                emit(context, this.name, 'USES_SUSPENSE', 'Detected React Suspense boundary');
        }
    }
}
exports.ReactVisitor = ReactVisitor;
class NextVisitor {
    name = 'NextVisitor';
    visitNode(node, context) {
        if (ts.isStringLiteral(node)) {
            if (node.text === 'use client')
                emit(context, this.name, 'USES_CLIENT_COMPONENTS', 'Detected "use client" directive');
            if (node.text === 'use server')
                emit(context, this.name, 'USES_SERVER_ACTIONS', 'Detected "use server" directive');
        }
    }
}
exports.NextVisitor = NextVisitor;
class VueVisitor {
    name = 'VueVisitor';
    visitNode(node, context) {
        if (ts.isCallExpression(node)) {
            const exp = node.expression.getText();
            if (exp === 'watch' || exp === 'watchEffect')
                emit(context, this.name, 'USES_WATCH', 'Detected Vue watch/watchEffect');
            if (exp === 'computed')
                emit(context, this.name, 'USES_COMPUTED', 'Detected Vue computed property');
        }
    }
}
exports.VueVisitor = VueVisitor;
class AngularVisitor {
    name = 'AngularVisitor';
    visitNode(node, context) {
        if (ts.isCallExpression(node)) {
            const exp = node.expression.getText();
            if (exp === 'signal')
                emit(context, this.name, 'USES_SIGNALS', 'Detected Angular Signal');
        }
    }
}
exports.AngularVisitor = AngularVisitor;
class SvelteVisitor {
    name = 'SvelteVisitor';
    visitNode(node, context) {
        if (ts.isCallExpression(node)) {
            const exp = node.expression.getText();
            if (exp === 'writable' || exp === 'derived')
                emit(context, this.name, 'USES_STORES', 'Detected Svelte store');
        }
    }
}
exports.SvelteVisitor = SvelteVisitor;
class AstroVisitor {
    name = 'AstroVisitor';
    visitNode(node, context) {
        if (ts.isJsxAttribute(node)) {
            const name = node.name.getText();
            if (name.startsWith('client:'))
                emit(context, this.name, 'USES_CLIENT_DIRECTIVES', 'Detected Astro client directive (Island)');
        }
    }
}
exports.AstroVisitor = AstroVisitor;
//# sourceMappingURL=index.js.map