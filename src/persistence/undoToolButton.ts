import * as ko from "knockout";
import { OfflineObjectStorage } from "../persistence";
import { ToolButton } from "../ui";
import { EventManager } from "../events";


const defaultTooltip = `<h1>Undo</h1><p>Undo last action.</p><div class="subtle">(Ctrl+Z)</div>`;

export class UndoToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-undo-25";
    public readonly title: string = "Undo";
    public readonly tooltip: ko.Observable<string>;
    public readonly disabled: ko.Observable<boolean>;

    constructor(
        private readonly eventManager: EventManager,
        private readonly offlineObjectStorage: OfflineObjectStorage
    ) {
        this.disabled = ko.observable(true);
        this.tooltip = ko.observable(defaultTooltip);
        this.eventManager.addEventListener("onDataChange", this.onDataChange.bind(this));
    }

    private onDataChange(): void {
        this.disabled(!this.offlineObjectStorage.canUndo());

        const description = this.offlineObjectStorage.getPrevStateDescription();

        if (description) {
            this.tooltip(`<h1>Undo</h1><p>Undo action: ${description}</p><div class="subtle">(Ctrl+Z)</div>`);
        }
        else {
            this.tooltip(defaultTooltip);
        }
    }

    public onActivate(): void {
        this.eventManager.dispatchEvent("onUndo");
    }
}
