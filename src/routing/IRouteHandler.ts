export interface IRouteHandler {
    /**
     * Returns current URL.
     */
    getCurrentUrl(): string;

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
    navigateTo(path: string, notifyListeners?: boolean): void;
}