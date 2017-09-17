import { IPermalink } from "../permalinks/IPermalink";
import { IPermalinkResolver } from "../permalinks/IPermalinkResolver";
import { IPermalinkService } from "../permalinks/IPermalinkService";
import { IMediaService } from "./IMediaService";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";

const DefaultSourceUrl = "http://placehold.it/800x600";

export class MediaPermalinkResolver implements IPermalinkResolver {
    private readonly permalinkService: IPermalinkService;
    private readonly mediaService: IMediaService;

    constructor(permalinkService: IPermalinkService, mediaService: IMediaService) {
        this.permalinkService = permalinkService;
        this.mediaService = mediaService;
    }

    public async getUriByPermalinkKey(permalinkKey: string): Promise<string> {
        let permalink = await this.permalinkService.getPermalinkByKey(permalinkKey);

        if (!permalink) {
            console.warn(`Permalink with key ${permalinkKey} not found.`);
            return null;
        }

        return this.getUriByPermalink(permalink);
    }

    public async getUriByPermalink(permalink: IPermalink): Promise<string> {
        if (!permalink.targetKey) {
            return null;
        }

        let media = await this.mediaService.getMediaByKey(permalink.targetKey);

        if (media) {
            return media.downloadUrl;
        }
        else {
            console.warn(`Media file with key ${permalink.targetKey} not found, setting default image.`);

            return DefaultSourceUrl;
        }
    }

    public async getHyperlinkByPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        if (!permalink.targetKey) {
            return null;
        }

        let media = await this.mediaService.getMediaByKey(permalink.targetKey);

        if (!media) {
            return null;
        }

        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = media.filename;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;
        hyperlinkModel.href = permalink.uri;
        hyperlinkModel.type = "media";

        return hyperlinkModel;
    }
}