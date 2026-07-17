import { z } from 'zod';
import { UVTConfig } from '@uvt/shared';
export declare const configSchema: z.ZodObject<{
    provider: z.ZodDefault<z.ZodString>;
    framework: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"auto">, z.ZodLiteral<"react">, z.ZodLiteral<"next">, z.ZodLiteral<"vue">, z.ZodLiteral<"angular">, z.ZodLiteral<"svelte">, z.ZodLiteral<"php">, z.ZodLiteral<"laravel">, z.ZodLiteral<"html">]>>;
    cache: z.ZodDefault<z.ZodBoolean>;
    workers: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"auto">, z.ZodNumber]>>;
    report: z.ZodDefault<z.ZodObject<{
        html: z.ZodDefault<z.ZodBoolean>;
        json: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        html: boolean;
        json: boolean;
    }, {
        html?: boolean | undefined;
        json?: boolean | undefined;
    }>>;
    dynamicDetection: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    provider: string;
    framework: "auto" | "react" | "next" | "vue" | "angular" | "svelte" | "php" | "laravel" | "html";
    cache: boolean;
    workers: number | "auto";
    report: {
        html: boolean;
        json: boolean;
    };
    dynamicDetection: boolean;
}, {
    provider?: string | undefined;
    framework?: "auto" | "react" | "next" | "vue" | "angular" | "svelte" | "php" | "laravel" | "html" | undefined;
    cache?: boolean | undefined;
    workers?: number | "auto" | undefined;
    report?: {
        html?: boolean | undefined;
        json?: boolean | undefined;
    } | undefined;
    dynamicDetection?: boolean | undefined;
}>;
export declare const DEFAULT_CONFIG: UVTConfig;
export declare function loadConfig(cwd: string): Promise<UVTConfig>;
//# sourceMappingURL=index.d.ts.map