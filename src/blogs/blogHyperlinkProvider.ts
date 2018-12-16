import { BlogPostContract } from "../blogs/BlogPostContract";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class BlogHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Blog posts";
    public readonly componentName = "blog-selector";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("posts/");
    }

    public getHyperlinkFromResource(post: BlogPostContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = post.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.targetKey = post.key;
        hyperlinkModel.href = post.permalink;
        hyperlinkModel.type = "post";

        return hyperlinkModel;
    }
}