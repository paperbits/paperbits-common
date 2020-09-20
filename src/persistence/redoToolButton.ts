import * as ko from "knockout";
import { OfflineObjectStorage } from "../persistence";
import { ToolButton } from "../ui";
import { EventManager } from "../events";

export class RedoToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-redo-26";
    public readonly title: string = "Redo";
    public readonly tooltip: string = `<h1>Redo</h1><p>Redo last undone action.</p><div class="subtle">(Ctrl+Y)</div>`;
    public readonly disabled: ko.Observable<boolean>;

    constructor(
        private readonly eventManager: EventManager,
        private readonly offlineObjectStorage: OfflineObjectStorage
    ) {
        this.disabled = ko.observable(true);
        this.eventManager.addEventListener("onDataChange", this.onDataChange.bind(this));
    }

    private onDataChange(): void {
        this.disabled(!this.offlineObjectStorage.canRedo());
    }
    public onActivate(): void {
        this.eventManager.dispatchEvent("onRedo");
    }
}
