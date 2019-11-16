import { Route } from "./route";

export interface Router {
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
    addRouteChangeListener?(eventHandler: (args?: any) => void): void;

    /**
     * Removes specified listener of route change event.
     * @param eventHandler Callback function.
     */
    removeRouteChangeListener?(eventHandler: (args?: any) => void): void;

    /**
     * Adds specified listener of history update event.
     * @param eventHandler Callback function.
     */
    addHistoryUpdateListener?(eventHandler: (args?: any) => void): void;

    /**
     * Removes specified listener of history update event.
     * @param eventHandler Callback function.
     */
    removeHistoryUpdateListener?(eventHandler: (args?: any) => void): void;

    /**
     * Navigates to specified URL.
     * @param url Absolute or relative path, i.e. https://paperbits.io or /about
     * @param title Destination title
     * @param metadata Associated metadata
     */
    navigateTo(url: string, title?: string, metadata?: Object): Promise<void>;

    /**
     * Update location history to specified URL.
     * @param url relative path, i.e. /about
     * @param title page title
     */
    updateHistory?(url: string, title?: string): void;

    /**
     * Returns current route.
     */
    getCurrentRoute(): Route;
}