import { IRouteChecker } from "./IRouteChecker";

export interface IRouteHandler {
    /**
     * Returns current URL.
     */
    getCurrentUrl(): string;

    getCurrentUrlMetadata(): Object;

    notifyListeners?: boolean;

    /**
     * Adds specified listener of route change event.
     * @param eventHandler Callback function.
     */
    addRouteChangeListener(eventHandler: (args?) => void): void;

    /**
     * Removes specified listener of route change event.
     * @param eventHandler Callback function.
     */
    removeRouteChangeListener(eventHandler: (args?) => void): void;

    /**
     * Changes current route to a specified URL.
     * @param path Relative path, i.e. /about
     * @param notifyListeners Indicates if route change event listeners should be notified. Dafault is "true".
     */
    navigateTo(path: string, metadata?: Object): void;

    /**
     * Adds a route checker in a pipeline to check navigation path
     * @param routeChecker - route checker to check is navigation path can be navigated or should be redirected to a specific path.
     */
    addRouteChecker(routeChecker: IRouteChecker);
    
    /**
     * Removes route checker from a pipeline
     * @param routeCheckerName - route checker name that should be removed  
     */
    removeRouteChecker(routeCheckerName: string);
}