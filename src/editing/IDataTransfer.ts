export interface IDataTransfer {
    source: string | File; // Paste: URL,                        drop: File,        media: permalink key
    name: string;          // Paste: last part of path,          drop: file.name,   media: file name
    mimeType?: string;     // Paste: undefined unless data://,   drop: File.type,   media: mimeType
}