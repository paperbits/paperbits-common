export interface IRouteChecker {

    /**
     * Checker name
     */
    name: string;
    
    /**
     * Method to check is navigation parameter "path" can be navigated.
     * If the checker allows to navigate to "path" then it returns "path"
     * If the checker do not allows to navigateto "path" then it should return another the redirect url 
     * @param path - navigation path that should be checked 
     */
    checkNavigatePath(path: string, metadata?: Object): Promise<string>;
}