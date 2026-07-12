"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.pinoLogger = void 0;
const pino_1 = __importDefault(require("pino"));
// ==========================================
// Structured Logging with Secret Redaction
// ==========================================
exports.pinoLogger = (0, pino_1.default)({
    level: process.env.DEBUG ? 'debug' : 'info',
    redact: {
        paths: [
            '*.Token', '*.token', '*.key', '*.secret', '*.password',
            'Token', 'token', 'key', 'secret', 'password', 'PERCY_TOKEN', 'percyToken'
        ],
        censor: '[REDACTED]'
    },
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            messageFormat: '{msg}'
        }
    }
});
// A thin wrapper for consistent interface and log styles
exports.logger = {
    info: (message, context) => {
        if (context)
            exports.pinoLogger.info(context, message);
        else
            exports.pinoLogger.info(message);
    },
    success: (message, context) => {
        // pretty log prefix for success
        if (context)
            exports.pinoLogger.info(context, `✔ ${message}`);
        else
            exports.pinoLogger.info(`✔ ${message}`);
    },
    warn: (message, context) => {
        if (context)
            exports.pinoLogger.warn(context, message);
        else
            exports.pinoLogger.warn(message);
    },
    error: (message, context) => {
        const msg = message instanceof Error ? message.stack || message.message : message;
        if (context)
            exports.pinoLogger.error(context, msg);
        else
            exports.pinoLogger.error(msg);
    },
    debug: (message, context) => {
        if (context)
            exports.pinoLogger.debug(context, message);
        else
            exports.pinoLogger.debug(message);
    },
    step: (step, message) => {
        exports.pinoLogger.info(`[${step}] ${message}`);
    }
};
//# sourceMappingURL=index.js.map