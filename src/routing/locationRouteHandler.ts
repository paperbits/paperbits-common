import { Events } from "../events";
import { Route, Router } from "./";

export class LocationRouteHandler {
    constructor(private readonly router: Router) {
        window.addEventListener(Events.PopState, this.onPopState.bind(this));
        router.addRouteChangeListener(this.onRouteChange);
    }

    private onPopState(event: PopStateEvent): void {
        const url = location.pathname + location.hash;
        this.router.navigateTo(url);
    }

    private onRouteChange(route: Route): void {
        const locationHash = location.hash.slice(1);

        if (route.path !== location.pathname || route.hash !== locationHash) {
            location.assign(route.url);
        }
    }
}