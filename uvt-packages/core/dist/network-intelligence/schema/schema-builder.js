"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaBuilder = void 0;
class SchemaBuilder {
    static buildSignature(method, url) {
        try {
            const parsed = new URL(url);
            // Normalize dynamic path parameters (e.g., /users/123 -> /users/:id)
            const pathname = parsed.pathname.replace(/\/[0-9a-fA-F-]{8,}/g, '/:id').replace(/\/\d+/g, '/:id');
            return `${method.toUpperCase()} ${pathname}`;
        }
        catch {
            return `${method.toUpperCase()} ${url}`;
        }
    }
    static inferSchema(payload) {
        const schema = {};
        const traverse = (obj, prefix = '') => {
            if (Array.isArray(obj)) {
                if (obj.length > 0) {
                    traverse(obj[0], `${prefix}[]`);
                }
                return;
            }
            if (obj !== null && typeof obj === 'object') {
                for (const key of Object.keys(obj)) {
                    const newPrefix = prefix ? `${prefix}.${key}` : key;
                    traverse(obj[key], newPrefix);
                }
                return;
            }
            // It's a primitive
            let type = typeof obj;
            if (type === 'string') {
                // basic datetime detection
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
                    type = 'datetime';
                }
                else if (/^[0-9a-fA-F-]{36}$/.test(obj)) {
                    type = 'uuid';
                }
            }
            schema[prefix] = type;
        };
        traverse(payload);
        return schema;
    }
}
exports.SchemaBuilder = SchemaBuilder;
//# sourceMappingURL=schema-builder.js.map