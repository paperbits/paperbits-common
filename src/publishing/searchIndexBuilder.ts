import * as lunr from "lunr";
import { stripHtml } from "../utils";
import { SearchableDocument } from "./searchableDocument";

export class SearchIndexBuilder {
    private documents: any[];

    constructor() {
        this.documents = [];
    }

    private getIndexerConfigFunc(documents: SearchableDocument[]): lunr.ConfigFunction {
        return function (): void {
            this.ref("permalink");
            this.field("title");
            this.field("description");
            this.field("body");

            documents.forEach(document => this.add(document), this);
        };
    }

    public appendText(permalink: string, title: string, description: string, text: string): void {
        this.append(permalink, title, description, text);
    }

    public appendHtml(permalink: string, title: string, description: string, html: string): void {
        try {
            this.append(permalink, title, description, stripHtml(html));
        }
        catch (error) {
            throw new Error(`Unable to index content for ${permalink}: ${error.stack || error.message}`);
        }
    }

    public append(permalink: string, title: string, description: string, content: string): void {
        if (!permalink || !title || !content) {
            return; // skip indexing
        }

        this.documents.push({
            permalink: permalink,
            title: title,
            description: description,
            body: content
        });
    }

    public buildIndex(): string {
        try {
            const index = lunr(this.getIndexerConfigFunc(this.documents));
            return JSON.stringify(index);
        }
        catch (error) {
            throw new Error(`Unable to build search index: ${error.stack || error.message}`);
        }
    }
}