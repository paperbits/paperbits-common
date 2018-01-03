import { BlogPostContract } from "@paperbits/common/blogs/BlogPostContract";
import { IBlogService } from "@paperbits/common/blogs/IBlogService";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { BlogPermalinkResolver } from "@paperbits/common/blogs/blogPermalinkResolver";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";


export class BlogHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Blog posts";
    public readonly componentName = "blog-selector";

    constructor(
        private readonly blogService: IBlogService,
        private readonly permalinkService: IPermalinkService) {
    }

    public canHandleHyperlink(permalink: IPermalink): boolean {
        return permalink.targetKey.startsWith("posts/");
    }

    public getHyperlinkFromLinkable(blogPost: BlogPostContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogPost.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = blogPost.permalinkKey;
        hyperlinkModel.type = "post";

        return hyperlinkModel;
    }

    public async getHyperlinkFromPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        if (permalink.targetKey && permalink.targetKey.startsWith("blogs/")) {
            const post = await this.blogService.getBlogPostByKey(permalink.targetKey);

            const hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = post.title;
            hyperlinkModel.target = target;
            hyperlinkModel.permalinkKey = permalink.key;
            hyperlinkModel.href = permalink.uri;
            hyperlinkModel.type = "post";

            return hyperlinkModel;
        }
        else if (permalink.parentKey) {
            const parentPermalink = await this.permalinkService.getPermalink(permalink.parentKey);
            const post = await this.blogService.getBlogPostByKey(parentPermalink.targetKey);
            const anchorTitle = post.anchors[permalink.key.replaceAll("/", "|")];

            const hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = anchorTitle;
            hyperlinkModel.target = target;
            hyperlinkModel.permalinkKey = permalink.key;
            hyperlinkModel.href = permalink.uri;
            hyperlinkModel.type = "post";

            return hyperlinkModel;
        }

        return null;
    }

    public getHyperlinkFromResource(blogPost: BlogPostContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogPost.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = blogPost.permalinkKey;
        hyperlinkModel.type = "post";

        return hyperlinkModel;
    }
}