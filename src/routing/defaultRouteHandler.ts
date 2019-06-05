import { IEventManager } from "../events";
import { IRouteHandler } from "../routing";
import { IRouteGuard } from "./IRouteGuard";
import { Route } from "./route";


export class RouteHandlerEvents {
    public static onRouteChange: string = "onRouteChange";
}

export class DefaultRouteHandler implements IRouteHandler {
    private currentRoute: Route;
    private originalPushState: (data: any, title: string, url: string) => void;

    public notifyListeners: boolean;

    constructor(
        private readonly routeGuards: IRouteGuard[],
        private readonly eventManager: IEventManager
    ) {
        // setting up...
        this.notifyListeners = true;

        this.originalPushState = history.pushState;
        history.pushState = this.pushState.bind(this);

        const path = location.pathname;
        const hash = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;
        const url =  location.pathname + hash;
        
        const route: Route = {
            url: url,
            path: path,
            metadata: {},
            hash: hash,
            previous: null
        };

        this.currentRoute = route;

        addEventListener("popstate", () => this.navigateTo(location.href));
    }

    private pushState(route: Route): void {
        this.originalPushState.call(history, route, route.title, route.url);

        if (this.notifyListeners) {
            this.eventManager.dispatchEvent(RouteHandlerEvents.onRouteChange, route);
        }
    }

    public addRouteChangeListener(eventHandler: (args?: any) => void): void {
        this.eventManager.addEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    public removeRouteChangeListener(eventHandler: (args?: any) => void): void {
        this.eventManager.removeEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    /**
     * Navigates to specified URL.
     * @param url Absolute or relative path, i.e. https://paperbits.io or /about
     * @param title Destination title
     * @param metadata Associated metadata
     */
    public async navigateTo(url: string, title: string = null, metadata: Object = {}): Promise<void> {
        if (!url) {
            return;
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

        const canActivate = await this.canActivate(route);

        if (canActivate) {
            this.currentRoute = route;
            this.pushState(route);
        }
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
                throw new Error(`Unable to invoke route a guard: ${error}`);
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