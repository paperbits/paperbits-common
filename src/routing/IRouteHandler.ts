export interface IRouteHandler {
    /**
     * Returns current URL.
     */
    getCurrentUrl(): string;

    /**
     * Returns path of the current URL.
     */
    getPath(): string;

    /**
     * Return hash of the current URL.
     */
    getHash(): string;

    /**
     * Returns metadata associates with current route.
     */
    getCurrentUrlMetadata(): Object;

    /**
     * Indicates whether route handler listeners need to be notified.
     */
    notifyListeners?: boolean;

    /**
     * Adds specified listener of route change event.
     * @param eventHandler Callback function.
     */
    addRouteChangeListener(eventHandler: (args?: any) => void): void;

    /**
     * Removes specified listener of route change event.
     * @param eventHandler Callback function.
     */
    removeRouteChangeListener(eventHandler: (args?: any) => void): void;

    /**
     * 
     * Changes current route to a specified URL.
     * @param path Relative path, i.e. /about
     * @param title 
     * @param metadata 
     */
    navigateTo(path: string, title?: string, metadata?: Object): Promise<void>;
}