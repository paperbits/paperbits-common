import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";

export class UrlHyperlinkProvider implements IHyperlinkProvider {
    public readonly name = "Web URL";
    public readonly componentName = "url-selector";

    public canHandleHyperlink(permalink: IPermalink): boolean {
        return !permalink;
    }

    public getHyperlinkFromResource(url: string): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "External link";
        hyperlinkModel.href = url;
        hyperlinkModel.target = "_blank";

        return hyperlinkModel;
    }

    public getHyperlinkFromUrl?(url: string, target: string = "blank"): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "External link";
        hyperlinkModel.target = target;
        hyperlinkModel.href = url;

        return hyperlinkModel;
    }

    public getResourceFromHyperlink(hyperlink: HyperlinkModel): string {
        return hyperlink.href;
    }
}