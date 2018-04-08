import { BlogPostContract } from "../blogs/BlogPostContract";
import { IPermalink } from "../permalinks/IPermalink";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class BlogHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Blog posts";
    public readonly componentName = "blog-selector";

    public canHandleHyperlink(permalink: IPermalink): boolean {
        return permalink.targetKey.startsWith("posts/");
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