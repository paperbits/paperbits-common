import { Route, RouteGuard } from ".";

export class JavaScriptRouteGuard implements RouteGuard {
    public async canActivate(route: Route): Promise<boolean> {
        return !route.url.includes("javascript:void(0)");
    }
}