import { BlogPostContract } from "../blogs/BlogPostContract";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class BlogHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Blog posts";
    public readonly componentName = "blog-selector";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("posts/");
    }

    public getHyperlinkFromResource(blogPost: BlogPostContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = blogPost.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.targetKey = blogPost.key;
        hyperlinkModel.type = "post";

        return hyperlinkModel;
    }
}