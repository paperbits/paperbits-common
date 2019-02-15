import { IViewManager } from "./../ui/IViewManager";
import { IEventManager } from "../events";

export class Hinter {
    private noHints: boolean;

    constructor(
        private readonly eventManager: IEventManager,
        private readonly viewManager: IViewManager
    ) {
        this.noHints = false;
        this.eventManager.addEventListener("DesignTimeNavigationHint", this.showDesignTimeNavigationHint.bind(this));
    }

    private showDesignTimeNavigationHint(): void {
        if (this.noHints) {
            return;
        }

        this.noHints = true;
        this.viewManager.notifyInfo("Did you know?", `When you're in the administrative view, you still can navigate any website hyperlinks by holding CTRL or ⌘ key and clicking on it.`);
        setTimeout(() => this.noHints = false, 8000);
    }
}