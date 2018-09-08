import { IEventManager } from "../events";
import { OfflineObjectStorage } from "./offlineObjectStorage";
import { IViewManager } from "../ui";


export class SavingHandler {
    constructor(eventManager: IEventManager, viewManager: IViewManager, objectStorage: OfflineObjectStorage) {
        eventManager.addEventListener("onSaveChanges", () => {
            const promise = objectStorage.saveChanges();
            viewManager.addPromiseProgressIndicator(promise, "Changes saved", "All changes were pushed to server");
        });
    }
}