import { EventManager } from "../events";
import { ViewManager } from "../ui";
import { OfflineObjectStorage } from ".";


export class SavingHandler {
    constructor(eventManager: EventManager, offlineObjectStorage: OfflineObjectStorage, viewManager: ViewManager) {
        eventManager.addEventListener("onSaveChanges", async () => {
            const hasChanges = await offlineObjectStorage.hasUnsavedChanges();

            if (!hasChanges) {
                return;
            }

            await offlineObjectStorage.saveChanges();
            viewManager.notifySuccess("Changes saved", "All changes saved successfully.");
        });
    }
}