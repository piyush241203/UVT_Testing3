import { Page } from 'playwright';
export interface InterceptedResponse {
    url: string;
    method: string;
    status: number;
    bodyText: string;
    dynamicFields: string[];
}
export declare class NetworkAnalyzer {
    private responses;
    private interceptedDynamicValues;
    constructor();
    setup(page: Page): void;
    getDynamicRegionsMaskingCSS(): string;
    getInterceptedResponses(): InterceptedResponse[];
    getInterceptedDynamicValues(): string[];
    private extractValues;
    private findDynamicFieldsInJSON;
}
//# sourceMappingURL=network-analyzer.d.ts.map