export interface MediaContract {
    /**
     * Own key.
     */
    key?: string;

    /**
     * A key that is used to identify a file in blob.
     */
    blobKey: string;

    /**
     * Display name of a file (i.e. picture.png). It is used to name target file during publishing.
     */
    filename: string;

    /**
     * File description. Used as additional information for authors.
     */
    description: string;

    /** 
     * File key words. Used for searching.
     */
    keywords: string;

    /**
     * Download URL. If available, maybe used for direct download.
     */
    downloadUrl?: string;

    /** 
     * Key of permalink referencing this media file.
     */
    permalinkKey?: string;

    /**
     * Content type of a file (i.e. image/png).
     */
    contentType?: string;
}