import { Route } from "./route";

/**
 * Route guard gets invoked by route handler before navigating to a route.
 */
export interface RouteGuard {
    /**
     * Checks if current route can be activated.
     * @param route {Route} Navigation route being be checked.
     */
    canActivate(route: Route): Promise<boolean>;
}