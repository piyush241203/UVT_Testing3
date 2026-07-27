import { z } from 'zod';
import { UVTConfig } from '@uvt/shared';
export declare const tcsePluginSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    mode: z.ZodDefault<z.ZodString>;
    confidenceThreshold: z.ZodDefault<z.ZodNumber>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    mode: z.ZodDefault<z.ZodString>;
    confidenceThreshold: z.ZodDefault<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    mode: z.ZodDefault<z.ZodString>;
    confidenceThreshold: z.ZodDefault<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">>;
export declare const tcseSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    plugins: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        mode: z.ZodDefault<z.ZodString>;
        confidenceThreshold: z.ZodDefault<z.ZodNumber>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        mode: z.ZodDefault<z.ZodString>;
        confidenceThreshold: z.ZodDefault<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        mode: z.ZodDefault<z.ZodString>;
        confidenceThreshold: z.ZodDefault<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    plugins: Record<string, z.objectOutputType<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        mode: z.ZodDefault<z.ZodString>;
        confidenceThreshold: z.ZodDefault<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>;
}, {
    enabled?: boolean | undefined;
    plugins?: Record<string, z.objectInputType<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        mode: z.ZodDefault<z.ZodString>;
        confidenceThreshold: z.ZodDefault<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">> | undefined;
}>>;
export declare const DEFAULT_TCSE_CONFIG: {
    enabled: boolean;
    plugins: {
        advertisement: {
            enabled: boolean;
            mode: string;
            confidenceThreshold: number;
        };
    };
};
export declare function validateTCSEConfig(input?: unknown): {
    enabled: boolean;
    plugins: Record<string, z.objectOutputType<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        mode: z.ZodDefault<z.ZodString>;
        confidenceThreshold: z.ZodDefault<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>;
} | {
    enabled: boolean;
    plugins: {
        advertisement: {
            enabled: boolean;
            mode: string;
            confidenceThreshold: number;
        };
    };
};
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
    tcse: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        plugins: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            mode: z.ZodDefault<z.ZodString>;
            confidenceThreshold: z.ZodDefault<z.ZodNumber>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            mode: z.ZodDefault<z.ZodString>;
            confidenceThreshold: z.ZodDefault<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            mode: z.ZodDefault<z.ZodString>;
            confidenceThreshold: z.ZodDefault<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        plugins: Record<string, z.objectOutputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            mode: z.ZodDefault<z.ZodString>;
            confidenceThreshold: z.ZodDefault<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>;
    }, {
        enabled?: boolean | undefined;
        plugins?: Record<string, z.objectInputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            mode: z.ZodDefault<z.ZodString>;
            confidenceThreshold: z.ZodDefault<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">> | undefined;
    }>>>;
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
    tcse?: {
        enabled: boolean;
        plugins: Record<string, z.objectOutputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            mode: z.ZodDefault<z.ZodString>;
            confidenceThreshold: z.ZodDefault<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>;
    } | undefined;
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
    tcse?: {
        enabled?: boolean | undefined;
        plugins?: Record<string, z.objectInputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            mode: z.ZodDefault<z.ZodString>;
            confidenceThreshold: z.ZodDefault<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">> | undefined;
    } | undefined;
}>;
export declare const DEFAULT_CONFIG: UVTConfig;
export declare function loadConfig(cwd: string): Promise<UVTConfig>;
//# sourceMappingURL=index.d.ts.map