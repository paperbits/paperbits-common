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
        const description = searchedDocument.querySelector("meta[name='description']")?.getAttribute("content");

        const searchResult: SearchResult = {
            title: title,
            summary: description,
            url: ref
        };

        return searchResult;
    }
}
