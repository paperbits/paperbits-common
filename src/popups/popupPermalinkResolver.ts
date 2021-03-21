import { HyperlinkContract } from "../editing";
import { IPermalinkResolver, HyperlinkModel } from "../permalinks";
import { IPopupService, PopupContract } from ".";


export class PopupPermalinkResolver implements IPermalinkResolver {
    constructor(private readonly popupService: IPopupService) { }

    public canHandleTarget(targetKey: string): boolean {
        return targetKey.startsWith("popups/");
    }

    public async getUrlByTargetKey(targetKey: string): Promise<string> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!targetKey.startsWith("popups/")) {
            return null;
        }

        try {
            const contentItem = await this.popupService.getPopupByKey(targetKey);

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

    private async getHyperlink(popupContract: PopupContract, target: string = "_self"): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.targetKey = popupContract.key;
        hyperlinkModel.href = popupContract.permalink;
        hyperlinkModel.title = popupContract.title || popupContract.permalink;
        hyperlinkModel.target = target;

        return hyperlinkModel;
    }

    public async getHyperlinkFromContract(hyperlinkContract: HyperlinkContract, locale?: string): Promise<HyperlinkModel> {
        if (!hyperlinkContract.targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!hyperlinkContract.targetKey.startsWith("popups/")) {
            return null;
        }

        let hyperlinkModel: HyperlinkModel;

        if (hyperlinkContract.targetKey) {
            const popupContract = await this.popupService.getPopupByKey(hyperlinkContract.targetKey, locale);

            if (popupContract) {
                return this.getHyperlink(popupContract, hyperlinkContract.target);
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

        if (!targetKey.startsWith("popups/")) {
            return null;
        }

        const contentItem = await this.popupService.getPopupByKey(targetKey, locale);

        if (!contentItem) {
            return null;
        }

        const hyperlink = await this.getHyperlink(contentItem);

        return hyperlink;
    }
}