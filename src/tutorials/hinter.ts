import { IViewManager } from "./../ui/IViewManager";
import { IEventManager } from "../events";

export class Hinter {
    constructor(
        private readonly eventManager: IEventManager,
        private readonly viewManager: IViewManager
    ) {
        this.eventManager.addEventListener("DesignTimeNavigationHint", this.showDesignTimeNavigationHint.bind(this));
    }

    private showDesignTimeNavigationHint(): void {
         this.viewManager.notifyInfo("Did you know?", `When you're in the administrative view, you still can navigate any website hyperlinks by holding CTRL or ⌘ key and clicking on it.`);
    }
}