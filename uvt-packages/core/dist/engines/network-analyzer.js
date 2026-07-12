"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkAnalyzer = void 0;
const shared_1 = require("@uvt/shared");
class NetworkAnalyzer {
    responses = [];
    interceptedDynamicValues = new Set();
    constructor() { }
    setup(page) {
        page.on('response', async (response) => {
            const request = response.request();
            const resourceType = request.resourceType();
            // Focus on fetch / XHR requests
            if (resourceType === 'fetch' || resourceType === 'xhr') {
                const method = request.method();
                const url = response.url();
                const status = response.status();
                try {
                    const bodyText = await response.text();
                    const dynamicFields = this.findDynamicFieldsInJSON(bodyText);
                    this.responses.push({
                        url,
                        method,
                        status,
                        bodyText,
                        dynamicFields
                    });
                    // Extract values
                    try {
                        const parsed = JSON.parse(bodyText);
                        this.extractValues(parsed, this.interceptedDynamicValues);
                    }
                    catch { }
                    if (dynamicFields.length > 0) {
                        shared_1.logger.debug(`Network Analyzer flagged dynamic JSON fields at ${url}: ${dynamicFields.join(', ')}`);
                    }
                }
                catch (e) {
                    // Response body is binary or not readable
                }
            }
        });
    }
    getDynamicRegionsMaskingCSS() {
        // Return CSS injection rules to hide common classes or attributes
        return '';
    }
    getInterceptedResponses() {
        return this.responses;
    }
    getInterceptedDynamicValues() {
        return Array.from(this.interceptedDynamicValues);
    }
    extractValues(obj, values) {
        if (obj === null || obj === undefined)
            return;
        if (typeof obj === 'string') {
            const trimmed = obj.trim();
            if (trimmed.length >= 3 && trimmed.length < 100) {
                values.add(trimmed);
            }
        }
        else if (typeof obj === 'number') {
            values.add(obj.toString());
            values.add(obj.toLocaleString('en-US'));
            values.add(obj.toFixed(2));
            values.add(obj.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        }
        else if (Array.isArray(obj)) {
            for (const item of obj) {
                this.extractValues(item, values);
            }
        }
        else if (typeof obj === 'object') {
            for (const key in obj) {
                if (key === 'icon' || key === 'type')
                    continue;
                try {
                    this.extractValues(obj[key], values);
                }
                catch { }
            }
        }
    }
    findDynamicFieldsInJSON(body) {
        const dynamicFields = [];
        try {
            const parsed = JSON.parse(body);
            const checkObject = (obj, path = '') => {
                if (!obj || typeof obj !== 'object')
                    return;
                Object.keys(obj).forEach(key => {
                    const fullPath = path ? `${path}.${key}` : key;
                    const val = obj[key];
                    // Dynamic field heuristics (Date, Time, UUID, Token, dynamic counts)
                    const lowerKey = key.toLowerCase();
                    const isKeyDynamicName = lowerKey.includes('date') ||
                        lowerKey.includes('time') ||
                        lowerKey.includes('uuid') ||
                        lowerKey.includes('token') ||
                        lowerKey.includes('timestamp') ||
                        lowerKey.includes('session');
                    if (isKeyDynamicName) {
                        dynamicFields.push(fullPath);
                    }
                    else if (typeof val === 'string') {
                        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
                        if (uuidRegex.test(val) || dateRegex.test(val)) {
                            dynamicFields.push(fullPath);
                        }
                    }
                    else if (typeof val === 'object' && val !== null) {
                        checkObject(val, fullPath);
                    }
                });
            };
            checkObject(parsed);
        }
        catch {
            // Not a JSON response
        }
        return dynamicFields;
    }
}
exports.NetworkAnalyzer = NetworkAnalyzer;
//# sourceMappingURL=network-analyzer.js.map