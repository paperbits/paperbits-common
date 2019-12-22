import { EventManager } from "../events";
import { ViewManager } from "../ui";
import { OfflineObjectStorage } from ".";


export class SavingHandler {
    constructor(eventManager: EventManager, offlineObjectStorage: OfflineObjectStorage, viewManager: ViewManager) {
        eventManager.addEventListener("onSaveChanges", async () => {
            await offlineObjectStorage.saveChanges();
        });
    }
}