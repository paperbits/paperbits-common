import { Route } from "./route";

export interface RouteHandler {
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
     * Navigates to specified URL.
     * @param url Absolute or relative path, i.e. https://paperbits.io or /about
     * @param title Destination title
     * @param metadata Associated metadata
     */
    navigateTo(url: string, title?: string, metadata?: Object): Promise<void>;

    getCurrentRoute(): Route;
}