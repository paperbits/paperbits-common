import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";

export class BlogHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Blog posts";
    public readonly componentName: string = "blog-selector";
    public readonly iconClass: string = "paperbits-icon paperbits-single-content-03";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("posts/");
    }
}