"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldClassifier = void 0;
class FieldClassifier {
    static classify(fieldName) {
        const name = fieldName.toLowerCase();
        // Business Data (Never Mask)
        const businessKeywords = ['title', 'name', 'description', 'category', 'brand', 'city', 'country', 'address', 'email', 'phone', 'price', 'quantity', 'rating', 'product', 'company', 'username', 'status', 'role'];
        if (businessKeywords.some(k => name === k || name.includes(k))) {
            return { category: 'Business', confidence: 100, reason: 'Matches business data keywords.', isDynamic: false };
        }
        // Identity (Dynamic)
        const identityKeywords = ['id', 'uuid', 'guid', 'traceid', 'requestid', 'transactionid', 'invoiceid', 'orderid'];
        if (identityKeywords.some(k => name === k || name.includes(k))) {
            return { category: 'Identity', confidence: 95, reason: 'Matches identity footprint.', isDynamic: true, recommendation: 'Mock Identity' };
        }
        // Time (Dynamic)
        const timeKeywords = ['createdat', 'updatedat', 'deletedat', 'timestamp', 'expiresat', 'expiry', 'date', 'time'];
        if (timeKeywords.some(k => name === k || name.includes(k))) {
            return { category: 'Time', confidence: 95, reason: 'Matches temporal footprint.', isDynamic: true, recommendation: 'Enable Date Stabilizer' };
        }
        // Authentication / Security (Dynamic)
        const authKeywords = ['token', 'accesstoken', 'refreshtoken', 'jwt', 'nonce', 'sessionid', 'otp', 'verificationcode', 'signature', 'checksum'];
        if (authKeywords.some(k => name === k || name.includes(k))) {
            return { category: 'Authentication', confidence: 100, reason: 'Matches auth footprint.', isDynamic: true, recommendation: 'Enable Authentication Stabilizer' };
        }
        // Versioning / Caching (Dynamic)
        const versionKeywords = ['etag', 'version', 'rev'];
        if (versionKeywords.some(k => name === k || name === k)) {
            return { category: 'Version', confidence: 80, reason: 'Matches version footprint.', isDynamic: true };
        }
        return { category: 'Custom', confidence: 0, reason: 'Unclassified field.', isDynamic: false };
    }
}
exports.FieldClassifier = FieldClassifier;
//# sourceMappingURL=field-classifier.js.map