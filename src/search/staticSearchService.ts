import * as lunr from "lunr";
import { SearchResult, SearchResultBuilder } from "@paperbits/common/search";
import { HttpClient } from "@paperbits/common/http";
import { WebPageSearchResultsBuilder } from "./webPageSearchResultsBuilder";


export interface SearchService {
    search(query: string): Promise<SearchResult[]>;
}

export class StaticSearchService {
    private index: lunr.Index;
    private searchResultBuilders: SearchResultBuilder[];

    constructor(private readonly httpClient: HttpClient) {
        this.searchResultBuilders = [new WebPageSearchResultsBuilder(httpClient)];
        this.loadIndex();
    }

    public async loadIndex(): Promise<void> {
        try {
            const response = await this.httpClient.send({ url: "/search-index.json", method: "GET" });

            if (response.statusCode !== 200) {
                return;
            }

            const indexData: any = response.toObject();
            this.index = lunr.Index.load(indexData);
        }
        catch (error) {
            console.log(error);
        }
    }

    public async search(query: string): Promise<SearchResult[]> {
        const searchRawResults = this.index.search(query).slice(0, 5);

        const results = [];

        for (const rawResult of searchRawResults) {
            const searchTerm = Object.keys(rawResult.matchData.metadata)[0];

            for (const resultBuilder of this.searchResultBuilders) {
                const result = await resultBuilder.getSearchResult(rawResult.ref, searchTerm);

                if (!result) {
                    continue;
                }

                results.push(result)
            }
        }

        return results;
    }

    public registerSearchResultBuilder(builder: SearchResultBuilder): void {
        this.searchResultBuilders.push(builder);
    }
}
