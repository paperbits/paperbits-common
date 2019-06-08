import { Router, Route } from ".";

export class LocationRouteHandler {
    constructor(router: Router) {
        router.addRouteChangeListener(this.onRouteChange);
    }

    private onRouteChange(route: Route): void {
        location.assign(route.url);
    }
}