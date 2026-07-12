import { RouteDescriptor } from '@uvt/shared';
export interface SelectiveTestingResult {
    affectedRoutes: RouteDescriptor[];
    changedFiles: string[];
}
export declare function getAffectedRoutes(cwd: string, routes: RouteDescriptor[]): Promise<SelectiveTestingResult>;
//# sourceMappingURL=selective-testing.d.ts.map