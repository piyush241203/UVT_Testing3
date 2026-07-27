export interface IABAdSize {
    name: string;
    width: number;
    height: number;
}
export declare const STANDARD_IAB_AD_SIZES: IABAdSize[];
export declare const KNOWN_AD_DOMAINS: Array<{
    domain: string;
    vendor: string;
}>;
export declare const AD_CSS_SELECTORS: string[];
export declare const AD_SCRIPT_PATTERNS: Array<{
    pattern: RegExp;
    vendor: string;
}>;
export declare function isIABAdDimension(width: number, height: number, tolerance?: number): IABAdSize | undefined;
export declare function matchAdDomain(url: string): string | undefined;
//# sourceMappingURL=ad-heuristics.d.ts.map