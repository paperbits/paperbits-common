import { EventManager } from "../events";
import { IViewManager } from "../ui";
import { OfflineObjectStorage } from ".";


export class SavingHandler {
    constructor(eventManager: EventManager, offlineObjectStorage: OfflineObjectStorage, viewManager: IViewManager) {
        eventManager.addEventListener("onSaveChanges", async () => {
            await offlineObjectStorage.saveChanges();
            viewManager.notifySuccess("Changes saved", "All changes were pushed to server");
        });
    }
}