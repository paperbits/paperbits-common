import * as ko from "knockout";
import { OfflineObjectStorage } from "../persistence";
import { ToolButton } from "../ui";
import { EventManager, Events } from "../events";


const defaultTooltip = `<h1>Redo</h1><p>Redo last undone action.</p><div class="subtle">(Ctrl+Y)</div>`;

export class RedoToolButton implements ToolButton {
    public readonly iconClass: string = "paperbits-icon paperbits-redo-26";
    public readonly title: string = "Redo";
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
        this.disabled(!this.offlineObjectStorage.canRedo());

        const description = this.offlineObjectStorage.getNextStateDescription();

        if (description) {
            this.tooltip(`<h1>Redo</h1><p>Redo action: ${description}</p><div class="subtle">(Ctrl+Y)</div>`);
        }
        else {
            this.tooltip(defaultTooltip);
        }
    }
    public onActivate(): void {
        this.eventManager.dispatchEvent(Events.Redo);
    }
}
