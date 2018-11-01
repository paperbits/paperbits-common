import { UrlContract } from "../urls/urlContract";
import { PermalinkContract } from "../permalinks/permalinkContract";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class UrlHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Web URL";
    public readonly componentName = "url-selector";

    public canHandleHyperlink(permalink: PermalinkContract): boolean {
        return permalink.targetKey && permalink.targetKey.startsWith("urls/");
    }

    public getHyperlinkFromResource(url: UrlContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = url.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = url.permalinkKey;
        hyperlinkModel.type = "url";

        return hyperlinkModel;
    }
}