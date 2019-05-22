import { IEventManager } from "../events";
import { IRouteHandler } from "../routing";
import { IRouteGuard } from "./IRouteGuard";


export class RouteHandlerEvents {
    public static onRouteChange: string = "onRouteChange";
}

export interface Route {
    path: string;
    previousPath: string;
    metadata: Object;
}

export class DefaultRouteHandler implements IRouteHandler {
    private metadata: Object;
    private path: string;
    private previousPath: string;
    private hash: string;
    private originalPushState: (data: any, title: string, url: string) => void;

    public notifyListeners: boolean;

    constructor(
        private readonly routeGuards: IRouteGuard[],
        private readonly eventManager: IEventManager
    ) {
        // rebinding...
        this.getCurrentUrl = this.getCurrentUrl.bind(this);

        // setting up...
        this.notifyListeners = true;

        this.originalPushState = history.pushState;
        history.pushState = this.pushState.bind(this);

        this.path = location.pathname;
        this.previousPath = this.path;
        this.hash = location.hash;

        addEventListener("popstate", () => this.navigateTo(location.href));
    }

    private pushState(data: any, title: string, url: string): void {
        const parts = url.split("#");

        this.previousPath = this.path;
        this.path = parts[0];
        this.hash = parts.length > 1 ? parts[1] : "";

        this.originalPushState.call(history, data, title, url);

        if (this.notifyListeners) {
            this.eventManager.dispatchEvent(RouteHandlerEvents.onRouteChange, {
                path: this.path,
                previousPath: this.previousPath,
                metadata: this.metadata,
                hash: this.getHash()
            });
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
    public async navigateTo(url: string, title: string = null, metadata: Object = null): Promise<void> {
        if (!url) {
            return;
        }

        const isFullUrl = url && (url.startsWith("http://") || url.startsWith("https://"));
        const isLocalUrl = url.startsWith(location.origin);

        if (isFullUrl && !isLocalUrl) {
            window.open(url, "_blank"); // navigating external link
            return;
        }

        const path = isFullUrl
            ? url.substring(location.origin.length)
            : url;

        const canActivate = await this.canActivate(path, metadata);

        if (canActivate) {
            this.applyNavigation(path, title, metadata);
        }
    }

    protected applyNavigation(path: string, title: string, metadata: Object): void {
        this.metadata = metadata;
        this.pushState(null, title, path);
    }

    protected async canActivate(path: string, metadata?: Object): Promise<boolean> {
        for (const guard of this.routeGuards) {
            try {
                const canActivate = await guard.canActivate(path, metadata);

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
        let permalink = this.path;

        const hash = this.getHash();

        if (this.hash) {
            permalink += "#" + hash;
        }

        return permalink;
    }

    public getCurrentUrlMetadata(): Object {
        return this.metadata;
    }

    public getPath(): string {
        return this.path;
    }

    public getHash(): string {
        return this.hash && this.hash.startsWith("#") ? this.hash.slice(1) : this.hash;
    }
}