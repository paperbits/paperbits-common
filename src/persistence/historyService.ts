import { OfflineObjectStorage } from "./offlineObjectStorage";
import { EventManager } from "../events";

export class HistoryService {
    constructor(
        private readonly offlineObjectStorage: OfflineObjectStorage,
        private readonly eventManager?: EventManager
    ) {
        if (eventManager) {
            this.eventManager.addEventListener("onUndo", this.onUndo.bind(this));
            this.eventManager.addEventListener("onRedo", this.onRedo.bind(this));
        }
    }

    public onUndo(): void {
        this.offlineObjectStorage.undo();
    }

    public onRedo(): void {
        this.offlineObjectStorage.redo();
    }
}