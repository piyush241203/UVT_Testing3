"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternMatcher = void 0;
class PatternMatcher {
    match(fingerprint, patterns) {
        return patterns.filter(p => {
            if (p.fingerprint === fingerprint.id)
                return true;
            if (p.framework && fingerprint.frameworks.includes(p.framework))
                return true;
            return false;
        });
    }
}
exports.PatternMatcher = PatternMatcher;
//# sourceMappingURL=pattern-matcher.js.map