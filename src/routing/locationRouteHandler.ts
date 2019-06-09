import { Route, Router } from ".";

export class LocationRouteHandler {
    constructor(private readonly router: Router) {
        window.addEventListener("popstate", this.onPopState.bind(this));
        router.addRouteChangeListener(this.onRouteChange);
    }

    private onPopState(event: PopStateEvent): void {
        const url = location.pathname + location.hash;
        this.router.navigateTo(url);
    }

    private onRouteChange(route: Route): void {
        if (route.path !== location.pathname) {
            location.assign(route.url);
        }
        else {
            history.pushState(null, null, route.url);
        }
    }
}