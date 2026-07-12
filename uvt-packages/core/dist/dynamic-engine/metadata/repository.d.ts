export interface RepositoryMetadata {
    readonly repositoryRoot: string;
    readonly hasGit: boolean;
    readonly currentBranch?: string;
    readonly commitHash?: string;
    readonly nodeVersion: string;
    readonly packageManagerVersion: string;
    readonly allDependencies: Readonly<Record<string, string>>;
}
//# sourceMappingURL=repository.d.ts.map