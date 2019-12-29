import { EventManager } from "../events";
import { ViewManager } from "../ui";
import { OfflineObjectStorage } from ".";


export class LoadingHandler {
    constructor(eventManager: EventManager, offlineObjectStorage: OfflineObjectStorage, viewManager: ViewManager) {
        eventManager.addEventListener("onLoadData", async () => {
            await offlineObjectStorage.loadData();
        });
    }
}