import { PermalinkContract } from "./permalinkContract";

export interface PermalinkService {
    /**
     * Determines if specified permalink already taken by a resource.
     * @param permalink 
     */
    isPermalinkDefined(permalink: string): Promise<boolean>;

    /**
     * Returns permalink for specified URI.
     * @param uri 
     */
    getPermalink(uri: string): Promise<PermalinkContract>;
}