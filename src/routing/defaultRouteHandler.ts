import { IEventManager } from "../events";
import { IRouteHandler } from "../routing";
import { IRouteGuard } from "./IRouteGuard";


export class RouteHandlerEvents {
    public static onRouteChange: string = "onRouteChange";
}

export class DefaultRouteHandler implements IRouteHandler {
    private metadata: Object;
    private path: string;
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
        this.hash = location.hash;

        addEventListener("popstate", () => this.navigateTo(location.href));
    }

    private pushState(data: any, title: string, url: string): void {
        const parts = url.split("#");

        this.path = parts[0];
        this.hash = parts.length > 1 ? parts[1] : "";

        this.originalPushState.call(history, data, title, url);

        if (this.notifyListeners) {
            this.eventManager.dispatchEvent(RouteHandlerEvents.onRouteChange);
        }
    }

    public addRouteChangeListener(eventHandler: (args?: any) => void): void {
        this.eventManager.addEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    public removeRouteChangeListener(eventHandler: (args?: any) => void): void {
        this.eventManager.removeEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    public async navigateTo(permalink: string, title: string = null, metadata: Object = null): Promise<void> {
        if (!permalink) {
            return;
        }

        const isFullUrl = permalink && permalink.charAt(0) !== "/" && permalink.charAt(0) !== "#";
        const isLocalUrl = permalink.startsWith(location.origin);

        if (isFullUrl && !isLocalUrl) {
            window.open(permalink, "_blank"); // navigating external link
            return;
        }

        const path = isFullUrl
            ? permalink.substring(location.origin.length)
            : permalink;

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
        return this.hash.startsWith("#") ? this.hash.slice(1) : this.hash;
    }
}