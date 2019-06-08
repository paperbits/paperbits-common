import { Router, Route } from ".";

export class HistoryRouteHandler {
    constructor(private readonly router: Router) {
        router.addRouteChangeListener(this.onRouteChange);
        window.addEventListener("popstate", this.onPopState.bind(this));
    }

    private onPopState(event: PopStateEvent): void {
        this.router.navigateTo(event.state.url);
    }

    private onRouteChange(route: Route): void {
        history.pushState(route, route.title, route.url);
    }
}