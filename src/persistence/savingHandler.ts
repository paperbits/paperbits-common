import { IEventManager } from "../events";
import { IViewManager } from "../ui";
import { OfflineObjectStorage } from ".";


export class SavingHandler {
    constructor(eventManager: IEventManager, offlineObjectStorage: OfflineObjectStorage, viewManager: IViewManager) {
        eventManager.addEventListener("onSaveChanges", async () => {
            const saveChangesPromise = offlineObjectStorage.saveChanges();
            viewManager.addPromiseProgressIndicator(saveChangesPromise, "Changes saved", "All changes were pushed to server");
        });
    }
}