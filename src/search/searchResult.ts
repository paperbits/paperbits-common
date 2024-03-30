export interface SearchResult {
    /**
     * 
     */
    iconUrl?: string;

    /**
     * Search result item URL, e.g. "/groceries/whole-milk".
     */
    url: string;

    /**
     * Search result item title, e.g. "Whole milk".
     */
    title: string;

    /**
     * Search result item summary.
     */
    summary: string;

    /**
     * Search result category, e.g. "Groceries".
     */
    category?: string;
}

