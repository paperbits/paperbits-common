import { HtmlPage } from "./htmlPage";
import { HtmlPagePublisherPlugin } from "./htmlPagePublisherPlugin";
import { IMediaService } from "../media";


export class SocialShareDataHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(private readonly mediaService: IMediaService) { }

    private appendLink(document: Document, rel: string, href: string): void {
        const canonicalLinkElement: HTMLStyleElement = document.createElement("link");
        canonicalLinkElement.setAttribute("rel", rel);
        canonicalLinkElement.setAttribute("href", href);
        document.head.appendChild(canonicalLinkElement);
    }

    private appendMetaTag(document: Document, name: string, content: string): void {
        const element: HTMLMetaElement = document.createElement("meta");
        element.setAttribute("name", name);
        element.setAttribute("content", content);

        document.head.appendChild(element);
    }

    public async apply(document: Document, page: HtmlPage): Promise<void> {
        if (!page.socialShareData?.image?.sourceKey) {
            return;
        }

        const media = await this.mediaService.getMediaByKey(page.socialShareData.image.sourceKey);

        if (!media) {
            return;
        }

        const baseUrl = page.siteHostName ? `https://${page.siteHostName}` : "";

        this.appendLink(document, "image_src", baseUrl + media.permalink);

        // this.appendMetaTag(document, "twitter:site", "@hostmeapp"); TODO: Collect Twitter data.
        this.appendMetaTag(document, "twitter:card", "summary_large_image");
        this.appendMetaTag(document, "twitter:title", page.socialShareData.title || page.title);
        this.appendMetaTag(document, "twitter:description", page.socialShareData.description || page.description);
        this.appendMetaTag(document, "twitter:image", baseUrl + media.permalink);

        const imageWidth = page.socialShareData?.image?.width;
        const imageHeight = page.socialShareData?.image?.height;

        if (imageWidth && imageHeight) {
            this.appendMetaTag(document, "twitter:image:width", imageWidth.toString());
            this.appendMetaTag(document, "twitter:image:height", imageHeight.toString());
        }
    }
}
