import { Router, Route } from ".";
import { ViewManager } from "../ui";

export class AnchorRouteHandler {
    constructor(router: Router, private readonly viewManager: ViewManager) {
        this.onRouteChange = this.onRouteChange.bind(this);
        router.addRouteChangeListener(this.onRouteChange);
        router.addHistoryUpdateListener(this.onRouteChange);
    }

    /**
     * Handles route change event.
     */
    private onRouteChange(route: Route): void {
        if (!route.hash) {
            return;
        }

        const hostDocument = this.viewManager.getHostDocument();
        const anchorElementSelector = `[id="${route.hash}"]`;
        const anchorElement = hostDocument.querySelector(anchorElementSelector);

        if (anchorElement) {
            anchorElement.scrollIntoView();
        }
    }
}