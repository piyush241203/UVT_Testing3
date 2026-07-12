import { Page, Browser } from 'playwright';
import { EventBus } from '../events/event-bus.js';
import { DSERegistry } from '../registry/registry.js';
import { UVTConfig } from '@uvt/shared';
import { SignalStore } from '../models/signal/store.js';
import { SignalGraph } from '../graph/graph.js';
import { ExecutionMetadata } from '../metadata/execution.js';
import { FrameworkMetadata } from '../metadata/framework.js';
import { RepositoryMetadata } from '../metadata/repository.js';
export interface ILogger {
    info(msg: string): void;
    debug(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
}
export interface ContextOptions {
    repositoryRoot: string;
    frameworkName: string;
    config: UVTConfig;
    logger: ILogger;
    page?: Page;
    browser?: Browser;
    registry: DSERegistry;
    eventBus: EventBus;
    frameworkMetadata?: FrameworkMetadata;
    repositoryMetadata?: RepositoryMetadata;
    astMetadata?: any;
    networkMetadata?: any;
    runtimeDomMetadata?: any;
    mutationMetadata?: any;
}
/**
 * Shared Execution Context passed to all Analyzers and Stabilizers.
 */
export declare class DynamicContext {
    readonly config: UVTConfig;
    readonly logger: ILogger;
    readonly page?: Page;
    readonly browser?: Browser;
    readonly registry: DSERegistry;
    readonly eventBus: EventBus;
    readonly signalStore: SignalStore;
    readonly signalGraph: SignalGraph;
    readonly frameworkMetadata?: FrameworkMetadata;
    readonly repositoryMetadata?: RepositoryMetadata;
    readonly astMetadata?: any;
    readonly networkMetadata?: any;
    readonly runtimeDomMetadata?: any;
    readonly mutationMetadata?: any;
    executionMetadata?: ExecutionMetadata;
    runtimeSnapshot?: any;
    domGraph?: any;
    mutationStream?: any[];
    duplicateDOMWalks: number;
    browserCount: number;
    metadataComputations: Map<string, number>;
    readonly runtimeMetadata: Map<string, unknown>;
    tracer?: any;
    recordDOMWalk(engineName: string): void;
    recordMetadataGen(metadataName: string): void;
    constructor(options: ContextOptions);
    setMetadata(key: string, value: unknown): void;
    getMetadata<T>(key: string): T | undefined;
}
//# sourceMappingURL=execution-context.d.ts.map