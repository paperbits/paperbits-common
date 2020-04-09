import { EventManager } from "../events";
import { ViewManager } from "../ui";
import { Logger } from "../logging";

export class UnhandledErrorHandler {
    constructor(
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly logger: Logger
    ) {
        this.eventManager.addEventListener("onError", this.handlerError.bind(this));
        window.addEventListener("unhandledrejection", this.handlerPromiseRejection.bind(this), true);
    }

    public handlerError(event: ErrorEvent): void {
        this.viewManager.notifyError("Oops, something went wrong.", "We are unable to complete your operation this time. Please try again later.");
        this.logger.traceError(event.error);
    }

    public handlerPromiseRejection(event: PromiseRejectionEvent): void {
        this.viewManager.notifyError("Oops, something went wrong.", "We are unable to complete your operation this time. Please try again later.");
        this.logger.traceError(event.reason);
    }
}