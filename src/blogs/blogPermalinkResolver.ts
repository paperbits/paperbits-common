import { IPermalink } from "../permalinks/IPermalink";
import { ILinkResolver } from "../permalinks/IPermalinkResolver";
import { IPermalinkService } from "../permalinks/IPermalinkService";
import { IBlogService } from "./IBlogService";
import { IHyperlink } from "../permalinks/IHyperlink";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";

export class BlogPermalinkResolver implements ILinkResolver {
    private readonly permalinkService: IPermalinkService;
    private readonly blogService: IBlogService;

    constructor(permalinkService: IPermalinkService, blogService: IBlogService) {
        this.permalinkService = permalinkService;
        this.blogService = blogService;
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
        return permalink.uri;
    }

    public async getHyperlinkByPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        if (!permalink.targetKey.startsWith("blogs/")) {
            return null;
        }

        let blogpost = await this.blogService.getBlogPostByKey(permalink.targetKey);

        if (!blogpost) {
            return null;
        }

        let hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogpost.title;
        hyperlinkModel.target = target;
        hyperlinkModel.permalinkKey = permalink.key;
        hyperlinkModel.href = permalink.uri;

        return hyperlinkModel;
    }
}