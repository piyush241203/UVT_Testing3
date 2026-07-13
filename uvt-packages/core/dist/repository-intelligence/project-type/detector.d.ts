import { RIEDetector, RIEContext } from '../models/models.js';
/**
 * Detects the project type: SPA, SSR, SSG, MPA, Hybrid, or Static.
 * Reads dependency and config file signals to infer the rendering model.
 */
export declare class ProjectTypeDetector implements RIEDetector {
    readonly name = "ProjectTypeDetector";
    detect(context: RIEContext): Promise<void>;
    private hasHtmlFiles;
    private countHtmlFiles;
}
//# sourceMappingURL=detector.d.ts.map