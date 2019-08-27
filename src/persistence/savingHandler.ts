import { IEventManager } from "../events";
import { IViewManager } from "../ui";
import { OfflineObjectStorage } from ".";


export class SavingHandler {
    constructor(eventManager: IEventManager, offlineObjectStorage: OfflineObjectStorage, viewManager: IViewManager) {
        eventManager.addEventListener("onSaveChanges", async () => {
            await offlineObjectStorage.saveChanges();
            viewManager.notifySuccess("Changes saved", "All changes were pushed to server");
        });
    }
}