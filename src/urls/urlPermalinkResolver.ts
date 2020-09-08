import { HyperlinkContract } from "../editing";
import { IPermalinkResolver, HyperlinkModel } from "../permalinks";
import { IUrlService, UrlContract } from ".";


export class UrlPermalinkResolver implements IPermalinkResolver {
    constructor(private readonly urlService: IUrlService) { }

    public canHandleTarget(targetKey: string): boolean {
        return targetKey.startsWith("urls/");
    }

    public async getUrlByTargetKey(targetKey: string): Promise<string> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!targetKey.startsWith("urls/")) {
            return null;
        }

        try {
            const contentItem = await this.urlService.getUrlByKey(targetKey);

            if (!contentItem) {
                console.warn(`Could not find permalink by key ${targetKey}.`);
                return null;
            }

            return contentItem.permalink;
        }
        catch (error) {
            return null;
        }
    }

    private async getHyperlink(urlContract: UrlContract, target: string = "_self"): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.targetKey = urlContract.key;
        hyperlinkModel.href = urlContract.permalink;
        hyperlinkModel.title = urlContract.title || urlContract.permalink;
        hyperlinkModel.target = target;

        return hyperlinkModel;
    }

    public async getHyperlinkFromContract(hyperlinkContract: HyperlinkContract, locale?: string): Promise<HyperlinkModel> {
        if (!hyperlinkContract.targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!hyperlinkContract.targetKey.startsWith("urls/")) {
            return null;
        }

        let hyperlinkModel: HyperlinkModel;

        if (hyperlinkContract.targetKey) {
            const urlContract = await this.urlService.getUrlByKey(hyperlinkContract.targetKey, locale);

            if (urlContract) {
                return this.getHyperlink(urlContract, hyperlinkContract.target);
            }
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlinkContract.target;
        hyperlinkModel.targetKey = hyperlinkContract.targetKey;
        hyperlinkModel.href = "#";
        hyperlinkModel.anchor = hyperlinkContract.anchor;

        return hyperlinkModel;
    }

    public async getHyperlinkByTargetKey(targetKey: string, locale?: string): Promise<HyperlinkModel> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!targetKey.startsWith("urls/")) {
            return null;
        }

        const contentItem = await this.urlService.getUrlByKey(targetKey, locale);

        if (!contentItem) {
            return null;
        }

        const hyperlink = await this.getHyperlink(contentItem);

        return hyperlink;
    }
}