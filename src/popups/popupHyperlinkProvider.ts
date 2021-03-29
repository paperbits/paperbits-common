import { IHyperlinkProvider } from "../ui";

export class PopupHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Popup";
    public readonly componentName: string = "popup-selector";
    public readonly iconClass: string = "paperbits-icon paperbits-polaroid";
    public readonly hyperlinkDetailsComponentName: string = "popup-hyperlink-details";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("popups/");
    }
}