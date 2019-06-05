import { Route } from "./route";

export interface IRouteGuard {
    /**
     * Checks if current route can be activated.
     * @param route {Route} Navigation route being be checked.
     */
    canActivate(route: Route): Promise<boolean>;
}