export interface IBlobStorage {
    /**
     * Lists all blobs in storage.
     */
    listBlobs?(): Promise<string[]>;

    /**
     * Uploads blob with specified key to storage.
     * @param blobKey Unique blob identifier.
     * @param content Content in form of byte array.
     * @param contentType Content type (MIME) of the content.
     */
    uploadBlob(blobKey: string, content: Uint8Array, contentType?: string): Promise<void>;

    /**
     * Downloads blob with specified key.
     * @param blobKey Unique blob identifier.
     */
    downloadBlob?(blobKey: string): Promise<Uint8Array>;

    /**
     * Returns download URL of uploaded blob.
     * @param blobKey Unique blob identifier.
     */
    getDownloadUrl(blobKey: string): Promise<string>;

    /**
     * Removes specified blob from memory.
     * @param blobKey Unique blob identifier.
     */
    deleteBlob(blobKey: string): Promise<void>;
}