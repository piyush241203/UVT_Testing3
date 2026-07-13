export interface ValidationError {
    field?: string;
    message: string;
    line?: number;
}
export interface ValidationResult {
    artifact: string;
    valid: boolean;
    errors: ValidationError[];
}
export declare class ArtifactValidator {
    /**
     * Validate a single generated artifact by inferring its type from the path.
     */
    static validate(artifactPath: string): Promise<ValidationResult>;
    /**
     * Validate YAML syntax using safe structural parsing.
     * Does not require js-yaml as a dependency — uses a lightweight
     * indentation and key-check approach.
     */
    static validateYAML(artifactPath: string): ValidationResult;
    /**
     * Validate JSON syntax and optionally check required fields.
     */
    static validateJSON(artifactPath: string, requiredFields?: string[]): ValidationResult;
    /**
     * Validate a batch of artifacts and return aggregated results.
     */
    static validateAll(artifactPaths: string[]): Promise<ValidationResult[]>;
}
//# sourceMappingURL=artifact-validator.d.ts.map