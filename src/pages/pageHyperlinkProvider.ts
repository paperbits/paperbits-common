import * as Constants from "./constants";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";

export class PageHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Pages";
    public readonly componentName: string = "page-selector";
    public readonly iconClass: string = "paperbits-icon paperbits-menu-4";
    public readonly hyperlinkDetailsComponentName: string = "page-hyperlink-details";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith(`${Constants.pagesRoot}/`);
    }
}