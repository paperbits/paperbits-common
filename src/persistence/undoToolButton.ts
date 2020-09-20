import * as ko from "knockout";
import { OfflineObjectStorage } from "../persistence";
import { ToolButton } from "../ui";
import { EventManager } from "../events";

export class UndoToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-undo-25";
    public readonly title: string = "Undo";
    public readonly tooltip: string = `<h1>Undo</h1><p>Undo last action.</p><div class="subtle">(Ctrl+Z)</div>`;
    public readonly disabled: ko.Observable<boolean>;

    constructor(
        private readonly eventManager: EventManager, 
        private readonly offlineObjectStorage: OfflineObjectStorage
    ) {
        this.disabled = ko.observable(true);
        this.eventManager.addEventListener("onDataChange", this.onDataChange.bind(this));
    }

    private onDataChange(): void {
        this.disabled(!this.offlineObjectStorage.canUndo());
    }

    public onActivate(): void {
        this.eventManager.dispatchEvent("onUndo");
    }
}
