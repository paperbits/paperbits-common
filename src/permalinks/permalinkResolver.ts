import { IPermalink, IPermalinkResolver, IPermalinkService } from "./";
import { HyperlinkContract } from "../editing";
import { HyperlinkModel } from "./hyperlinkModel";

export class PermalinkResolver implements IPermalinkResolver {
    private readonly permalinkService: IPermalinkService;
    private readonly permalinkResolvers: IPermalinkResolver[];

    constructor(permalinkService: IPermalinkService, permalinkResolvers: IPermalinkResolver[] = []) {
        this.permalinkService = permalinkService;
        this.permalinkResolvers = permalinkResolvers;
    }

    public async getUrlByPermalinkKey(permalinkKey: string): Promise<string> {
        if (!permalinkKey) {
            throw new Error("Permalink key cannot be null or empty.");
        }

        const permalink = await this.permalinkService.getPermalinkByKey(permalinkKey);

        if (!permalink) {
            throw new Error(`Could not find permalink with key ${permalinkKey}.`);
        }

        return this.getUriByPermalink(permalink);
    }

    public async getUriByPermalink(permalink: IPermalink): Promise<string> {
        if (!permalink) {
            throw new Error("Permalink cannot be null or empty.");
        }

        for (const permalinkResolver of this.permalinkResolvers) {
            const resolvedUri = await permalinkResolver.getUriByPermalink(permalink);

            if (resolvedUri) {
                return resolvedUri;
            }
        }

        return permalink.uri;
    }

    public async getHyperlinkByPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        let hyperlinkModel: HyperlinkModel;

        for (const permalinkResolver of this.permalinkResolvers) {
            hyperlinkModel = await permalinkResolver.getHyperlinkByPermalink(permalink, target);

            if (hyperlinkModel) {
                return hyperlinkModel;
            }
        }
    }

    public async getHyperlinkFromConfig(hyperlink: HyperlinkContract): Promise<HyperlinkModel> {
        let hyperlinkModel: HyperlinkModel;

        let permalinkKey: string = null;

        if (hyperlink.permalinkKey) {
            permalinkKey = hyperlink.permalinkKey;
        }

        if (permalinkKey) {
            const permalink = await this.permalinkService.getPermalinkByKey(permalinkKey);

            if (permalink) {
                hyperlinkModel = await this.getHyperlinkByPermalink(permalink, hyperlink.target);

                if (!hyperlinkModel) {
                    hyperlinkModel = new HyperlinkModel();
                    hyperlinkModel.title = permalink.uri;
                    hyperlinkModel.target = hyperlink.target || "_blank";
                    hyperlinkModel.permalinkKey = permalink.key;
                    hyperlinkModel.href = permalink.uri;
                    hyperlinkModel.type = "url";
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
            hyperlinkModel.type = "url";

            return hyperlinkModel;
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlink.target || "_blank";
        hyperlinkModel.permalinkKey = null;
        hyperlinkModel.href = "#";
        hyperlinkModel.type = "url";

        return hyperlinkModel;
    }

    public async getHyperlinkByPermalinkKey(permalinkKey: string): Promise<HyperlinkModel> {
        const permalink = await this.permalinkService.getPermalinkByKey(permalinkKey);
        const hyperlink = await this.getHyperlinkByPermalink(permalink, "blank");

        return hyperlink;
    }
}