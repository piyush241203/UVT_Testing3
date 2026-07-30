import { Page } from 'playwright';
export declare class VCLCertifier {
    private static getVclDir;
    /**
     * Phase 1 — Capture Original State before TCSE executes
     */
    static captureOriginalState(page: Page, cwd: string, framework: string, routeName: string, routeUrl: string): Promise<string>;
    /**
     * Phase 2 — Capture Detection (DynamicSignal)
     */
    static captureDetection(cwd: string, routeId: string, tcseResult: any): Promise<void>;
    /**
     * Phase 3 — Capture DOM Transformation & Diff
     */
    static captureDomTransformation(page: Page, cwd: string, routeId: string, tcseResult: any): Promise<void>;
    /**
     * Phase 4 — Layout Certification & CLS
     */
    static captureLayoutCertification(page: Page, cwd: string, routeId: string): Promise<void>;
    /**
     * Phase 5 — Generate side-by-side comparisons highlighting ad regions
     */
    static generateVisualComparison(page: Page, cwd: string, routeId: string): Promise<void>;
}
//# sourceMappingURL=vcl-certifier.d.ts.map