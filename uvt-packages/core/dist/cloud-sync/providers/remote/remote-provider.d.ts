export interface RemoteProvider {
    uploadArtifact(resourceType: string, resourceId: string, payload: any): Promise<boolean>;
    downloadArtifact(resourceType: string, resourceId: string): Promise<any>;
}
export declare class MockRemoteProvider implements RemoteProvider {
    uploadArtifact(resourceType: string, resourceId: string, payload: any): Promise<boolean>;
    downloadArtifact(resourceType: string, resourceId: string): Promise<any>;
}
//# sourceMappingURL=remote-provider.d.ts.map