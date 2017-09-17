export interface IObjectStorageMiddleware {
    applyChanges(key: string, changesObject: Object): Promise<void>;
}