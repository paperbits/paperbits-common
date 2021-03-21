import * as Utils from "../utils";
import { PopupContract } from "../popups/popupContract";
import { IPopupService } from "../popups/IPopupService";
import { IObjectStorage, Query, Page } from "../persistence";
import * as _ from "lodash";

const popupsPath = "popups";

export class PopupService implements IPopupService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public async getPopupByKey(key: string): Promise<PopupContract> {
        return await this.objectStorage.getObject<PopupContract>(key);
    }

    private convertPage(pageOfPopups: Page<PopupContract>): Page<PopupContract> {
        const resultPage: Page<PopupContract> = {
            value: pageOfPopups.value,
            takeNext: async (): Promise<Page<PopupContract>> => {
                const nextLocalizedPage = await pageOfPopups.takeNext();
                return this.convertPage(nextLocalizedPage);
            }
        };

        if (!pageOfPopups.takeNext) {
            resultPage.takeNext = null;
        }

        return resultPage;
    }

    public async search(query: Query<PopupContract>): Promise<Page<PopupContract>> {
        if (!query) {
            throw new Error(`Parameter "query" not specified.`);
        }

        try {
            const pageOfResults = await this.objectStorage.searchObjects<PopupContract>(popupsPath, query);
            return this.convertPage(pageOfResults);

        }
        catch (error) {
            throw new Error(`Unable to search popup: ${error.stack || error.message}`);
        }
    }

    public async deletePopup(popup: PopupContract): Promise<void> {
        const deletePopupPromise = this.objectStorage.deleteObject(popup.key);
        await Promise.all([deletePopupPromise]);
    }

    public async createPopup(permalink: string, title: string, description?: string): Promise<PopupContract> {
        const key = `${popupsPath}/${Utils.guid()}`;

        const contract: PopupContract = {
            key: key,
            title: title,
            description: description,
            permalink: permalink
        };

        await this.objectStorage.addObject(key, contract);

        return contract;
    }

    public async updatePopup(popup: PopupContract): Promise<void> {
        await this.objectStorage.updateObject<PopupContract>(popup.key, popup);
    }
}
