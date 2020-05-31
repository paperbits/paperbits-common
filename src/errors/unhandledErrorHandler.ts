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
        if (!event.error) {
            const message = event.target
                ? `Unparsable error for element: ${event.target.toString()}`
                : `Unparsable error thrown.`;

            this.logger.traceError(new Error(message));
            return;
        }

        this.viewManager.notifyError("Oops, something went wrong.", "We are unable to complete your operation this time. Please try again later.");
        this.logger.traceError(event.error);
    }

    public handlerPromiseRejection(event: PromiseRejectionEvent): void {
        if (!event.reason) {
            const message = event.target
                ? `Unhandled rejection for target: ${event.target.toString()}`
                : `Unhandled rejection.`;

            this.logger.traceError(new Error(message));
            return;
        }

        this.viewManager.notifyError("Oops, something went wrong.", "We are unable to complete your operation this time. Please try again later.");
        this.logger.traceError(new Error(`Unhandled rejection: ${event.reason}`));
    }
}