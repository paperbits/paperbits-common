import { HtmlPage } from "./htmlPage";
import { HtmlPagePublisherPlugin } from "./htmlPagePublisherPlugin";
import { IMediaService } from "../media";


export class OpenGraphHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(private readonly mediaService: IMediaService) { }

    private appendMetaTag(document: Document, property: string, content: string): void {
        const element: HTMLMetaElement = document.createElement("meta");
        element.setAttribute("property", property);
        element.setAttribute("content", content);

        document.head.appendChild(element);
    }

    public async apply(document: Document, page: HtmlPage): Promise<void> {
        if (page.openGraph?.type) {
            this.appendMetaTag(document, "og:type", page.openGraph.type);
        }

        if (page.openGraph?.siteName) {
            this.appendMetaTag(document, "og:site_name", page.openGraph.siteName);
        }

        const title = page.openGraph?.title || page.title;

        if (title) {
            this.appendMetaTag(document, "og:title", title);
        }

        const description = page.openGraph?.description || page.description;

        if (description) {
            this.appendMetaTag(document, "og:description", description);
        }

        const url = page.openGraph?.url || page.url;

        if (url) {
            this.appendMetaTag(document, "og:url", url);
        }

        const imageSourceKey = page.openGraph?.image?.sourceKey || page.socialShareData?.image?.sourceKey;

        if (!imageSourceKey) {
            return;
        }

        const media = await this.mediaService.getMediaByKey(imageSourceKey);

        if (!media) {
            return;
        }

        const baseUrl = page.siteHostName ? `https://${page.siteHostName}` : "";
        this.appendMetaTag(document, "og:image", baseUrl + media.permalink);

        const imageWidth = page.openGraph?.image?.width || page.socialShareData?.image?.width;
        const imageHeight = page.openGraph?.image?.height || page.socialShareData?.image?.height;

        if (imageWidth && imageHeight) {
            this.appendMetaTag(document, "og:image:width", imageWidth.toString());
            this.appendMetaTag(document, "og:image:height", imageHeight.toString());
        }
    }
}
