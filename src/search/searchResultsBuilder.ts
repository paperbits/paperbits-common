import { SearchResult } from "./searchResult";

export interface SearchResultBuilder {
    /**
     * Returns search result record.
     * @param ref - Search index reference, used to build actual search result record.
     * @param query - A query that was used to get index reference.
     */
    getSearchResult(ref: string, query: string): Promise<SearchResult>;
}
