import * as ko from "knockout";
import { ToolButton } from "../ui";
import { EventManager } from "../events";
import { OfflineObjectStorage } from "../persistence";
import { Logger } from "../logging";


export class SaveChangesToolButton implements ToolButton {
    public iconClass: string = "paperbits-icon paperbits-floppy-disk";
    public title: string = "Save changes";
    public tooltip: string = "Save changes";
    public disabled: ko.Observable<boolean>;

    constructor(
        private readonly eventManager: EventManager,
        private readonly offlineObjectStorage: OfflineObjectStorage,
        private readonly logger: Logger
    ) {
        this.disabled = ko.observable(true);
        this.eventManager.addEventListener("onDataChange", this.updateState.bind(this));
        this.updateState();
    }

    private async updateState(): Promise<void> {
        const hasUnsavedChanges = await this.offlineObjectStorage.hasUnsavedChanges();
        this.disabled(!hasUnsavedChanges);
    }

    public onActivate(): void {
        this.logger.trackEvent("Click: Save changes");
        this.eventManager.dispatchEvent("onSaveChanges");
    }
}