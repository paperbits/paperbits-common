import { CachingStrategy } from "../caching";

export interface OfflineOptions {
    autosave?: boolean;
    cachingStrategy?: CachingStrategy;
}