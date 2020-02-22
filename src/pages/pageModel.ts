export class PageModel {
    /**
     * Own key.
     */
    public key?: string;

    /**
     * Page title.
     */
    public title: string;

    /**
     * Page description. This property is included in SEO attributes.
     */
    public description: string;

    /**
     * Page keywords. This property is included in SEO attributes.
     */
    public keywords: string;

    /**
     * Facebook Open Graph: This is how you describe the kind of object you are sharing: website, article, blog.
     */
    public ogType?: "website" | "article" | "blog";

    /**
     * Facebook Open Graph: This is how you ensure that a particular thumbnail will be shown when your page is shared.
     */
    public ogImageSourceKey?: string;

    /**
     * JSON-LD (JavaScript Object Notation for Linked Data) for this page.
     */
    public jsonLd?: string;
}