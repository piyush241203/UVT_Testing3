import { Command } from 'commander';
export declare const program: Command;
/**
 * Detect the default dev-server port for the framework found in `cwd`.
 * This mirrors the per-framework port table in generateGHAWorkflow() so that
 * `uvt run` and `uvt test` use the right port automatically when no --port
 * flag is supplied by the caller.
 */
export declare function detectFrameworkPort(cwd: string): number;
export declare function generateGHAWorkflow(cwd: string): string;
//# sourceMappingURL=index.d.ts.map