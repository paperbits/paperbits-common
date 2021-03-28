import { IHyperlinkProvider } from "../ui";

export class UrlHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Web URL";
    public readonly componentName: string = "url-selector";
    public readonly iconClass: string = "paperbits-icon paperbits-link-69-2";
    public readonly hyperlinkDetailsComponentName: string = "url-hyperlink-details";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("urls/");
    }
}