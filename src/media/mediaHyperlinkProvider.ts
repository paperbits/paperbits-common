import { MediaContract } from "../media/mediaContract";
import { IPermalink } from "../permalinks/IPermalink";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class MediaHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Media";
    public readonly componentName = "media-selector";

    public canHandleHyperlink(permalink: IPermalink): boolean {
        return permalink.targetKey.startsWith("uploads/");
    }

    public getHyperlinkFromResource(media: MediaContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = media.filename;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = media.permalinkKey;
        hyperlinkModel.type = "media";

        return hyperlinkModel;
    }
}