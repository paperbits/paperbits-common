import { MediaContract } from "@paperbits/common/media/mediaContract";
import { IMediaService } from "@paperbits/common/media/IMediaService";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";


export class MediaHyperlinkProvider implements IHyperlinkProvider {
    private readonly permalinkService: IPermalinkService;
    private readonly mediaService: IMediaService;

    public readonly name: string = "Media";
    public readonly componentName = "media-selector";

    constructor(permalinkService: IPermalinkService, mediaService: IMediaService) {
        this.permalinkService = permalinkService;
        this.mediaService = mediaService;
    }

    public canHandleHyperlink(permalink: IPermalink): boolean {
        return permalink.targetKey.startsWith("uploads/");
    }

    public getHyperlinkFromLinkable(media: MediaContract): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = media.filename;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = media.permalinkKey;
        hyperlinkModel.type = "media";

        return hyperlinkModel;
    }

    public async getHyperlinkFromPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        let media = await this.mediaService.getMediaByKey(permalink.targetKey);

        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = media.filename;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;
        hyperlinkModel.type = "media";

        return hyperlinkModel;
    }

    public getHyperlinkFromResource(media: MediaContract): HyperlinkModel {
        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = media.filename;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = media.permalinkKey;
        hyperlinkModel.type = "media";

        return hyperlinkModel;
    }

    public async getResourceFromHyperlink(hyperlink: HyperlinkModel): Promise<MediaContract> {
        let permalink = await this.permalinkService.getPermalinkByKey(hyperlink.permalinkKey);
        let media = await this.mediaService.getMediaByKey(permalink.targetKey);

        return media;
    }
}