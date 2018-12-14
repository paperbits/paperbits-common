import { MediaContract } from "../media/mediaContract";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class MediaHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Media";
    public readonly componentName = "media-selector";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("uploads/");
    }

    public getHyperlinkFromResource(media: MediaContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = media.filename;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.targetKey = media.key;
        hyperlinkModel.type = "media";

        return hyperlinkModel;
    }
}