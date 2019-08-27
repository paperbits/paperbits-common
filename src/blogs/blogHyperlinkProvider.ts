import { BlogPostContract } from "../blogs/blogPostContract";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class BlogHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Blog posts";
    public readonly componentName: string = "blog-selector";
    public readonly iconClass: string = "paperbits-icon paperbits-single-content-03";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("posts/");
    }

    public getHyperlinkFromResource(post: BlogPostContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = post.title;
        hyperlinkModel.targetKey = post.key;
        hyperlinkModel.href = post.permalink;

        return hyperlinkModel;
    }
}