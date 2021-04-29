import { Route, RouteGuard } from ".";

export class MailtoRouteGuard implements RouteGuard {
    public async canActivate(route: Route): Promise<boolean> {
        return !route.path.startsWith("mailto:");
    }
}