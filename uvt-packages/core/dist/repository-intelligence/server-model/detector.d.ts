import { RIEDetector, RIEContext } from '../models/models.js';
/**
 * Infers the server model, dev server start command, output directory,
 * and lockfile glob pattern from repository signals.
 */
export declare class ServerModelDetector implements RIEDetector {
    readonly name = "ServerModelDetector";
    detect(context: RIEContext): Promise<void>;
}
//# sourceMappingURL=detector.d.ts.map