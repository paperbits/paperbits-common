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
        this.eventManager.addEventListener("onUnhandledRejection", this.handlerPromiseRejection.bind(this));
    }

    public handlerError(event: ErrorEvent): void {
        if (!event.error) {
            let message: string;

            if (event.target) {
                message = `Unparsable error for element: ${event.target.toString()}`;

                if (navigator.sendBeacon && event.target["src"]) {
                    navigator.sendBeacon(event.target["src"]);
                }
            }
            else {
                message = `Unparsable error thrown.`;
            }

            this.logger.trackError(new Error(message));
            return;
        }

        this.viewManager.notifyError("Oops, something went wrong.", "We are unable to complete your operation this time. Please try again later.");
        this.logger.trackError(event.error);
    }

    public handlerPromiseRejection(event: PromiseRejectionEvent): void {
        if (!event.reason) {
            const message = event.target
                ? `Unhandled rejection for target: ${event.target.toString()}`
                : `Unhandled rejection.`;

            this.logger.trackError(new Error(message));
            return;
        }

        this.viewManager.notifyError("Oops, something went wrong.", "We are unable to complete your operation this time. Please try again later.");
        this.logger.trackError(new Error(`Unhandled rejection: ${event.reason}`));
    }
}