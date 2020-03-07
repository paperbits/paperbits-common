import { HtmlPage } from "./htmlPage";

export interface HtmlPagePublisherPlugin {
    apply(document: Document, page?: HtmlPage): void;
}
