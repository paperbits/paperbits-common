import { Route, RouteGuard } from ".";

export class DefaultRouteGuard implements RouteGuard {
    public async canActivate(route: Route): Promise<boolean> {
        return true;
    }
}