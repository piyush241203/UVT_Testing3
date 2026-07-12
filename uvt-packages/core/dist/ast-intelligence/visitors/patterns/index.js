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
exports.RealtimeVisitor = exports.ComponentVisitor = exports.BrowserAPIVisitor = exports.NetworkVisitor = exports.TimerVisitor = exports.RandomVisitor = exports.DateVisitor = void 0;
const ts = __importStar(require("typescript"));
const index_js_1 = require("../../../dynamic-engine/index.js");
function emit(context, analyzer, tag, reason) {
    context.emitSignal({
        id: `aie-${tag}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        analyzerId: analyzer,
        analyzerType: 'ast',
        framework: 'unknown',
        category: index_js_1.SignalCategory.COMPONENT,
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
class DateVisitor {
    name = 'DateVisitor';
    visitNode(node, context) {
        if (ts.isNewExpression(node) && node.expression.getText() === 'Date') {
            emit(context, this.name, 'USES_DYNAMIC_DATE', 'Detected new Date() instantiation.');
        }
        if (ts.isCallExpression(node) && node.expression.getText() === 'Date.now') {
            emit(context, this.name, 'USES_DYNAMIC_DATE', 'Detected Date.now() call.');
        }
    }
}
exports.DateVisitor = DateVisitor;
class RandomVisitor {
    name = 'RandomVisitor';
    visitNode(node, context) {
        if (ts.isCallExpression(node)) {
            const exp = node.expression.getText();
            if (exp === 'Math.random')
                emit(context, this.name, 'USES_RANDOM_VALUES', 'Detected Math.random()');
            if (exp === 'crypto.randomUUID' || exp === 'uuid')
                emit(context, this.name, 'USES_UUID', 'Detected UUID generation');
        }
    }
}
exports.RandomVisitor = RandomVisitor;
class TimerVisitor {
    name = 'TimerVisitor';
    visitNode(node, context) {
        if (ts.isCallExpression(node)) {
            const exp = node.expression.getText();
            if (exp === 'setTimeout')
                emit(context, this.name, 'USES_TIMEOUT', 'Detected setTimeout usage');
            if (exp === 'setInterval')
                emit(context, this.name, 'USES_INTERVAL', 'Detected setInterval usage');
            if (exp === 'requestAnimationFrame')
                emit(context, this.name, 'USES_ANIMATION_FRAME', 'Detected requestAnimationFrame');
        }
    }
}
exports.TimerVisitor = TimerVisitor;
class NetworkVisitor {
    name = 'NetworkVisitor';
    visitNode(node, context) {
        if (ts.isCallExpression(node)) {
            const exp = node.expression.getText();
            if (exp === 'fetch')
                emit(context, this.name, 'USES_FETCH', 'Detected fetch API call');
            if (exp === 'axios.get' || exp === 'axios.post')
                emit(context, this.name, 'USES_AXIOS', 'Detected axios network request');
        }
    }
}
exports.NetworkVisitor = NetworkVisitor;
class BrowserAPIVisitor {
    name = 'BrowserAPIVisitor';
    visitNode(node, context) {
        if (ts.isPropertyAccessExpression(node) || ts.isIdentifier(node)) {
            const text = node.getText();
            if (text === 'localStorage')
                emit(context, this.name, 'USES_LOCAL_STORAGE', 'Detected localStorage access');
            if (text === 'sessionStorage')
                emit(context, this.name, 'USES_SESSION_STORAGE', 'Detected sessionStorage access');
        }
    }
}
exports.BrowserAPIVisitor = BrowserAPIVisitor;
class ComponentVisitor {
    name = 'ComponentVisitor';
    visitNode(node, context) {
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
            let tagName = '';
            if (ts.isJsxElement(node)) {
                tagName = node.openingElement.tagName.getText();
            }
            else {
                tagName = node.tagName.getText();
            }
            const classifications = ['Avatar', 'Table', 'Grid', 'Form', 'Modal', 'Chart', 'Map', 'Toast', 'Video', 'Canvas'];
            for (const cls of classifications) {
                if (tagName.includes(cls)) {
                    context.classifyComponent(cls);
                    emit(context, this.name, `COMPONENT_${cls.toUpperCase()}`, `Classified component as ${cls}`);
                }
            }
        }
    }
}
exports.ComponentVisitor = ComponentVisitor;
class RealtimeVisitor {
    name = 'RealtimeVisitor';
    visitNode(node, context) {
        if (ts.isNewExpression(node) && node.expression.getText() === 'WebSocket') {
            emit(context, this.name, 'USES_WEBSOCKET', 'Detected new WebSocket()');
        }
        if (ts.isNewExpression(node) && node.expression.getText() === 'EventSource') {
            emit(context, this.name, 'USES_EVENTSOURCE', 'Detected new EventSource()');
        }
    }
}
exports.RealtimeVisitor = RealtimeVisitor;
//# sourceMappingURL=index.js.map