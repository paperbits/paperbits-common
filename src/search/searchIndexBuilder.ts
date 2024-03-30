import * as lunr from "lunr";
import { stripHtml } from "../utils";
import { SearchableDocument } from "./searchableDocument";


export class SearchIndexBuilder {
    private documents: SearchableDocument[];

    constructor() {
        this.documents = [];
    }

    private getIndexerConfigFunc(documents: SearchableDocument[]): lunr.ConfigFunction {
        return function (): void {
            this.ref("ref");
            this.field("title");
            this.field("description");
            this.field("body");

            documents.forEach(document => this.add(document), this);
        };
    }

    public appendText(ref: string, title: string, description: string, text: string): void {
        this.append(ref, title, description, text);
    }

    public appendHtml(ref: string, title: string, description: string, html: string): void {
        try {
            this.append(ref, title, description, stripHtml(html));
        }
        catch (error) {
            throw new Error(`Unable to index content for ${ref}: ${error.stack || error.message}`);
        }
    }

    public append(ref: string, title: string, summary: string, content: string): void {
        if (!ref || !title || !content) {
            return; // skip indexing
        }

        this.documents.push({
            ref: ref,
            title: title,
            summary: summary,
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