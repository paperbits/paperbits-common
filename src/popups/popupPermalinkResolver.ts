import { HyperlinkContract } from "../editing";
import { IPermalinkResolver, HyperlinkModel } from "../permalinks";
import { IPopupService, PopupContract } from ".";
import { ILocaleService } from "../localization";

const popupsPath = "popups/";

export class PopupPermalinkResolver implements IPermalinkResolver {
    constructor(
        private readonly popupService: IPopupService,
        private readonly localeService: ILocaleService
    ) { }

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

            return contentItem.key;
        }
        catch (error) {
            return null;
        }
    }

    private async getHyperlink(popupContract: PopupContract, hyperlinkContract?: HyperlinkContract): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.targetKey = popupContract.key;
        hyperlinkModel.href = popupContract.permalink;
        hyperlinkModel.title = popupContract.title || popupContract.permalink;

        if (hyperlinkContract) {
            hyperlinkModel.target = hyperlinkContract.target;
        }

        return hyperlinkModel;
    }

    public async getHyperlinkFromContract(hyperlinkContract: HyperlinkContract, locale?: string): Promise<HyperlinkModel> {
        if (!hyperlinkContract.targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!hyperlinkContract.targetKey.startsWith(popupsPath)) {
            return null;
        }

        let hyperlinkModel: HyperlinkModel;

        if (hyperlinkContract.targetKey) {
            const popupContract = await this.popupService.getPopupByKey(hyperlinkContract.targetKey, locale);

            if (popupContract) {
                return this.getHyperlink(popupContract, hyperlinkContract);
            }
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlinkContract.target;
        hyperlinkModel.targetKey = hyperlinkContract.targetKey;
        hyperlinkModel.triggerEvent = hyperlinkModel.triggerEvent;
        hyperlinkModel.href = "#";

        return hyperlinkModel;
    }

    public async getHyperlinkByTargetKey(targetKey: string, locale?: string): Promise<HyperlinkModel> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!targetKey.startsWith(popupsPath)) {
            return null;
        }

        const defaultLocale = await this.localeService.getDefaultLocaleCode();
        let popupContract = await this.popupService.getPopupByKey(targetKey, locale);

        if (!popupContract) {
            popupContract = await this.popupService.getPopupByKey(targetKey, defaultLocale);

            if (!popupContract) {
                console.warn(`Could create hyperlink for target with key ${targetKey} in locale ${locale}.`);
                return null;
            }
        }
        else if (locale && locale !== defaultLocale) {
            popupContract.permalink = `/${locale}${popupContract.permalink}`;
        }

        const hyperlink = await this.getHyperlink(popupContract);

        return hyperlink;
    }
}