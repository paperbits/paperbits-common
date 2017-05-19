import { IPermalink } from "./IPermalink";
import { ILinkResolver } from "./IPermalinkResolver";
import { IPermalinkService } from "./IPermalinkService";
import { IHyperlink } from "./IHyperlink";
import { HyperlinkModel } from "./hyperlinkModel";

export class PermalinkResolver implements ILinkResolver {
    private readonly permalinkService: IPermalinkService;
    private readonly permalinkResolvers: ILinkResolver[];

    constructor(permalinkService: IPermalinkService, permalinkResolvers: ILinkResolver[] = []) {
        this.permalinkService = permalinkService;
        this.permalinkResolvers = permalinkResolvers;
    }

    public async getUriByPermalinkKey(permalinkKey: string): Promise<string> {
        let permalink = await this.permalinkService.getPermalinkByKey(permalinkKey)

        return this.getUriByPermalink(permalink);
    }

    public async getUriByPermalink(permalink: IPermalink): Promise<string> {
        for (let i = 0; i < this.permalinkResolvers.length; i++) {
            let resolvedUri = await this.permalinkResolvers[i].getUriByPermalink(permalink);

            if (resolvedUri) {
                return resolvedUri;
            }
        }

        return permalink.uri;
    }

    public async getHyperlinkByPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        let hyperlinkModel: HyperlinkModel;

        for (let i = 0; i < this.permalinkResolvers.length; i++) {
            hyperlinkModel = await this.permalinkResolvers[i].getHyperlinkByPermalink(permalink, target);

            if (hyperlinkModel) {
                return hyperlinkModel;
            }
        }
    }

    public async getHyperlinkFromConfig(hyperlink: IHyperlink): Promise<HyperlinkModel> {
        let hyperlinkModel: HyperlinkModel;

        let permalinkKey: string = null;

        if (hyperlink.permalinkKey) {
            permalinkKey = hyperlink.permalinkKey;
        }

        if (permalinkKey) {
            let permalink = await this.permalinkService.getPermalinkByKey(permalinkKey);

            if (permalink) {
                hyperlinkModel = await this.getHyperlinkByPermalink(permalink, hyperlink.target);

                if (!hyperlinkModel) {
                    hyperlinkModel = new HyperlinkModel();
                    hyperlinkModel.title = permalink.uri;
                    hyperlinkModel.target = hyperlink.target || "_blank";
                    hyperlinkModel.permalinkKey = permalink.key;
                    hyperlinkModel.href = permalink.uri
                }

                return hyperlinkModel;
            }
        }

        if (hyperlink.href) {
            hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = "External link";
            hyperlinkModel.target = hyperlink.target || "_blank";
            hyperlinkModel.permalinkKey = null;
            hyperlinkModel.href = hyperlink.href;

            return hyperlinkModel;
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlink.target || "_blank";
        hyperlinkModel.permalinkKey = null;
        hyperlinkModel.href = "#";

        return hyperlinkModel;
    }
}