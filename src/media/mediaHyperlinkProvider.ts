import { MediaContract } from "../media/mediaContract";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";
import * as Constants from "./constants";


export class MediaHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Media";
    public readonly componentName: string = "media-selector";
    public readonly iconClass: string = "paperbits-icon paperbits-image-2";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith(`${Constants.mediaRoot}/`);
    }

    public getHyperlinkFromResource(media: MediaContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = media.fileName;
        hyperlinkModel.targetKey = media.key;
        hyperlinkModel.href = media.permalink;

        return hyperlinkModel;
    }
}