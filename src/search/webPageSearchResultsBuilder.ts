import { SearchResult, SearchResultBuilder } from "@paperbits/common/search";
import { HttpClient } from "@paperbits/common/http";
import { MimeTypes } from "../mimeTypes";
import { stripHtml } from "../utils";


export class WebPageSearchResultsBuilder implements SearchResultBuilder {
    constructor(private readonly httpClient: HttpClient) { }

    public async getSearchResult(ref: string, query: string): Promise<SearchResult> {
        if (!ref.startsWith("/")) {
            return null;
        }

        const response = await this.httpClient.send({
            url: ref,
            method: "GET"
        });

        const text = response.toText();
        const parser = new DOMParser();
        const searchedDocument: Document = parser.parseFromString(text, MimeTypes.textHtml);
        const title = searchedDocument.title;
        const body = stripHtml(searchedDocument.body.innerHTML);
        const fragmentSize = 150;
        const index = body.toLowerCase().indexOf(query.toLowerCase());

        let startIndex = index - Math.floor(fragmentSize / 2);

        if (startIndex < 0) {
            startIndex = 0;
        }

        const pageFragment = `...${body.substring(startIndex, startIndex + fragmentSize)}...`;

        const searchResult: SearchResult = {
            title: title,
            summary: pageFragment,
            url: ref
        };

        return searchResult;
    }
}
