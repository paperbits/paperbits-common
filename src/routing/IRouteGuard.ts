export interface IRouteGuard {
    /**
     * Method to check is navigation parameter "path" can be navigated.
     * If the checker allows to navigate to "path" then it returns "path"
     * If the checker do not allows to navigateto "path" then it should return another the redirect url 
     * @param route - navigation path that should be checked 
     */
    canActivate(route: string, metadata?: Object): Promise<boolean>;
}