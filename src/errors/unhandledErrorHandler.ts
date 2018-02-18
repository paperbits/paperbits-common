import { IEventManager } from "../events/IEventManager";
import { IViewManager } from "../ui/IViewManager";

export class UnhandledErrorHandler {
    constructor(
        private readonly eventManager: IEventManager,
        private readonly viewManager: IViewManager
    ) {
        eventManager.addEventListener("onError", this.handlerError.bind(this));
    }

    public handlerError(event: ErrorEvent): void {
        this.viewManager.notifySuccess("Oops. Something went wrong", event.message);
    }
}