import { IEventManager } from "../events/IEventManager";
import { OfflineObjectStorage } from "./offlineObjectStorage";


export class SavingHandler {
    constructor(eventManager: IEventManager, objectStorage: OfflineObjectStorage) {
        eventManager.addEventListener("onSaveChanges", () => { objectStorage.saveChanges(); });
    }
}