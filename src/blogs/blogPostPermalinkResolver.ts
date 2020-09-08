import { IBlogService, BlogPostContract } from ".";
import { Contract } from "../contract";
import { HyperlinkContract } from "../editing";
import { HyperlinkModel, IPermalinkResolver } from "../permalinks";
import { ContentItemContract } from "../contentItems";

const blogPostsPath = "blogPosts/";

export class BlogPostPermalinkResolver implements IPermalinkResolver {
    constructor(private readonly blogPostService: IBlogService) { }

    public canHandleTarget(targetKey: string): boolean {
        return targetKey.startsWith(blogPostsPath);
    }

    public async getUrlByTargetKey(targetKey: string, locale?: string): Promise<string> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!targetKey.startsWith(blogPostsPath)) {
            return null;
        }

        const contentItem = await this.blogPostService.getBlogPostByKey(targetKey, locale);

        if (!contentItem) {
            throw new Error(`Could not find permalink by key ${targetKey}.`);
        }

        return contentItem.permalink;
    }

    private async getHyperlink(blogPostContract: BlogPostContract, target: string = "_self"): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.targetKey = blogPostContract.key;
        hyperlinkModel.href = blogPostContract.permalink;
        hyperlinkModel.title = blogPostContract.title || blogPostContract.permalink;
        hyperlinkModel.target = target;
        hyperlinkModel.targetKey = blogPostContract.key;

        return hyperlinkModel;
    }

    public async getHyperlinkFromContract(hyperlinkContract: HyperlinkContract, locale?: string): Promise<HyperlinkModel> {
        if (!hyperlinkContract.targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!hyperlinkContract.targetKey.startsWith("blogPosts/")) {
            return null;
        }

        let hyperlinkModel: HyperlinkModel;

        if (hyperlinkContract.targetKey) {
            const blogPostContract = await this.blogPostService.getBlogPostByKey(hyperlinkContract.targetKey, locale);

            if (blogPostContract) {
                return this.getHyperlink(blogPostContract, hyperlinkContract.target);
            }
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlinkContract.target;
        hyperlinkModel.targetKey = hyperlinkContract.targetKey;
        hyperlinkModel.href = "#";
        hyperlinkModel.anchor = hyperlinkContract.anchor;

        return hyperlinkModel;
    }

    public async getHyperlinkByTargetKey(targetKey: string, locale?: string): Promise<HyperlinkModel> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!targetKey.startsWith(blogPostsPath)) {
            return null;
        }

        const contentItem = await this.blogPostService.getBlogPostByKey(targetKey, locale);

        if (!contentItem) {
            return null;
        }

        const hyperlink = await this.getHyperlink(contentItem);

        return hyperlink;
    }

    public async getContentByPermalink(permalink: string, locale?: string): Promise<Contract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const blogPostContract = await this.blogPostService.getBlogPostByPermalink(permalink, locale);
        const blogPostContent = await this.blogPostService.getBlogPostContent(blogPostContract.key);

        return blogPostContent;
    }

    public async getContentItemByPermalink(permalink: string, locale?: string): Promise<ContentItemContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const blogPostContract = await this.blogPostService.getBlogPostByPermalink(permalink, locale);

        return blogPostContract;
    }
}