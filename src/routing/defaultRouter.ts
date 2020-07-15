import { EventManager } from "../events";
import { Router, RouterEvents, Route, RouteGuard } from ".";


export class DefaultRouter implements Router {
    private notificationTimeout: any;
    public currentRoute: Route;
    public notifyListeners: boolean;

    constructor(
        private readonly routeGuards: RouteGuard[],
        private readonly eventManager: EventManager
    ) {
        this.notifyListeners = true;
        this.currentRoute = this.getRouteFromLocation();
    }

    public getRouteFromLocation(): Route {
        const path = location.pathname;
        const hash = location.hash.startsWith("#") ? location.hash.slice(1) : null;
        const url = path + (hash ? `#${hash}` : "");

        const route: Route = {
            url: url,
            path: path,
            hash: hash,
            metadata: {},
            previous: null
        };

        return route;
    }

    public addRouteChangeListener(eventHandler: (args?: any) => void): void {
        this.eventManager.addEventListener(RouterEvents.onRouteChange, eventHandler);
    }

    public removeRouteChangeListener(eventHandler: (args?: any) => void): void {
        this.eventManager.removeEventListener(RouterEvents.onRouteChange, eventHandler);
    }

    public addHistoryUpdateListener(eventHandler: (args?: any) => void): void {
        this.eventManager.addEventListener(RouterEvents.onHistoryUpdate, eventHandler);
    }

    public removeHistoryUpdateListener(eventHandler: (args?: any) => void): void {
        this.eventManager.removeEventListener(RouterEvents.onHistoryUpdate, eventHandler);
    }

    /**
     * Navigates to specified URL.
     * @param url Absolute or relative path, i.e. https://paperbits.io or /about
     * @param title Destination title
     * @param metadata Associated metadata
     */
    public async navigateTo(url: string, title: string = null, metadata: Object = {}): Promise<void> {
        const route = this.getRoute(url, title, metadata);

        if (!route) {
            return;
        }

        const canActivate = await this.canActivate(route);

        if (canActivate) {
            this.currentRoute = route;

            if (this.notifyListeners) {
                this.scheduleNotification(route);
            }
        }
    }

    private scheduleNotification(route: Route): void {
        clearTimeout(this.notificationTimeout);

        this.notificationTimeout = setTimeout(() => {
            this.eventManager.dispatchEvent(RouterEvents.onRouteChange, route);
        }, 100);
    }

    public updateHistory(url: string, title: string): void {
        const route = this.getRoute(url, title);

        if (!route) {
            return;
        }

        if (this.notifyListeners) {
            this.eventManager.dispatchEvent(RouterEvents.onHistoryUpdate, route);
        }
    }

    private getRoute(url: string, title: string = null, metadata: Object = {}): Route {
        if (!url) {
            return undefined;
        }

        const isFullUrl = url && (url.startsWith("http://") || url.startsWith("https://"));
        const isLocalUrl = url.startsWith(location.origin);

        if (isFullUrl && !isLocalUrl) {
            window.open(url, "_blank"); // navigating external link
            return;
        }

        url = isFullUrl
            ? url.substring(location.origin.length)
            : url;

        const parts = url.split("#");

        const route: Route = {
            url: url,
            path: parts.length > 1 ? parts[0] || location.pathname : parts[0],
            title: title,
            metadata: metadata,
            hash: parts.length > 1 ? parts[1] : "",
            previous: this.currentRoute
        };

        return route;
    }

    protected async canActivate(route: Route): Promise<boolean> {
        for (const routeGuard of this.routeGuards) {
            try {
                const canActivate = await routeGuard.canActivate(route);

                if (!canActivate) {
                    return false;
                }
            }
            catch (error) {
                throw new Error(`Unable to invoke route a guard: ${error.stack || error.message}`);
                return false;
            }
        }

        return true;
    }

    public getCurrentUrl(): string {
        let permalink = this.currentRoute.path;

        const hash = this.getHash();

        if (this.currentRoute.hash) {
            permalink += "#" + hash;
        }

        return permalink;
    }

    public getCurrentUrlMetadata(): Object {
        return this.currentRoute.metadata;
    }

    public getPath(): string {
        return this.currentRoute.path;
    }

    public getHash(): string {
        return this.currentRoute.hash;
    }

    public getCurrentRoute(): Route {
        return this.currentRoute;
    }
}