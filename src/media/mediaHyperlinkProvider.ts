import * as Constants from "./constants";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";

export class MediaHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Media";
    public readonly componentName: string = "media-selector";
    public readonly iconClass: string = "paperbits-icon paperbits-image-2";
    public readonly hyperlinkDetailsComponentName: string = "media-hyperlink-details";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith(`${Constants.mediaRoot}/`);
    }
}