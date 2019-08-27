import { UrlContract } from "../urls";
import { IHyperlinkProvider } from "../ui";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class UrlHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Web URL";
    public readonly componentName: string = "url-selector";
    public readonly iconClass: string = "paperbits-icon paperbits-link-69-2";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("urls/");
    }

    public getHyperlinkFromResource(url: UrlContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = url.title;
        hyperlinkModel.targetKey = url.key;
        hyperlinkModel.href = url.permalink;

        return hyperlinkModel;
    }
}