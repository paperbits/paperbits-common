import { Router, Route } from ".";
import { Events } from "../events";
import { Logger } from "../logging";

export class HistoryRouteHandler {
    private internalPushState: (data: any, title: string, url: string) => void;

    constructor(
        private readonly router: Router,
        private readonly logger: Logger
    ) {
        this.internalPushState = history.pushState;
        history.pushState = this.externalPushState.bind(this);
        this.onRouteChange = this.onRouteChange.bind(this);
        router.addRouteChangeListener(this.onRouteChange);
        router.addHistoryUpdateListener(this.onRouteChange);
        window.addEventListener(Events.PopState, this.onPopState.bind(this));
    }

    private onPopState(event: PopStateEvent): void {
        const url = location.pathname + location.hash;
        this.router.navigateTo(url);
    }

    /**
     * Intercepts external pushState invocations.
     */
    private externalPushState(route: Route): void {
        this.router.navigateTo(route.url);
    }

    /**
     * Handles internal route change event.
     */
    private onRouteChange(route: Route): void {
        try {
            this.internalPushState.call(history, route, route.title, route.url);
        }
        catch (error) {
            this.logger.trackError(error);
        }
    }
}