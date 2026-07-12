export declare class FastFileScanner {
    static scan(cwd: string): Promise<string[]>;
    static readFilesContent(files: string[], limit?: number): Promise<{
        path: string;
        content: string;
    }[]>;
}
//# sourceMappingURL=file-scanner.d.ts.map