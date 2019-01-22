import { IEventManager } from "../events";
import { IViewManager } from "../ui";
import { IObjectStorage } from "./IObjectStorage";


export class SavingHandler {
    constructor(eventManager: IEventManager, viewManager: IViewManager, objectStorage: IObjectStorage) {
        // eventManager.addEventListener("onSaveChanges", () => {
        //     const promise = objectStorage.saveChanges();
        //     viewManager.addPromiseProgressIndicator(promise, "Changes saved", "All changes were pushed to server");
        // });
    }
}