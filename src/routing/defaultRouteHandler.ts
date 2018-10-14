import { IEventManager } from "../events";
import { IRouteHandler } from "../routing";


export class RouteHandlerEvents {
    public static onRouteChange = "onRouteChange";
}

export class DefaultRouteHandler implements IRouteHandler {
    private path: string;
    private metadata: Object;
    public notifyListeners: boolean;

    constructor(
        private readonly eventManager: IEventManager
    ) {
        // initialization...
        this.eventManager = eventManager;

        // rebinding...
        this.getCurrentUrl = this.getCurrentUrl.bind(this);

        // setting up...
        this.path = "";
        this.notifyListeners = true;

        addEventListener("popstate", () => this.navigateTo(location.pathname));
    }

    public addRouteChangeListener(eventHandler: (args?) => void): void {
        this.eventManager.addEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    public removeRouteChangeListener(eventHandler: (args?) => void): void {
        this.eventManager.removeEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    public navigateTo(url: string, metadata: Object = null): void {
        if (!url) {
            return;
        }

        const isFullUrl = !url.startsWith("/");
        const isLocalUrl = url.startsWith(location.origin);

        if (isFullUrl && !isLocalUrl) {
            window.open(url, "_blank"); // navigating external link
            return;
        }

        const path = isFullUrl
            ? url.substring(location.origin.length)
            : url;

        if (path === this.path && this.metadata === metadata) {
            return;
        }

        this.metadata = metadata;

        if (path.contains("#")) {
            const parts = path.split("#");
            const pathname = parts[0];
            const hash = parts[1];

            if (pathname === location.pathname) {
                return; // TODO: Figure out how to navigate anchors.
            }
        }

        this.path = path;

        history.pushState(null, null, path);

        if (this.notifyListeners) {
            this.eventManager.dispatchEvent(RouteHandlerEvents.onRouteChange);
        }
    }

    public getCurrentUrl(): string {
        let permalink = this.path;

        if (permalink === "") {
            permalink = location.pathname;
        }

        return permalink;
    }

    public getCurrentUrlMetadata(): Object {
        return this.metadata;
    }
}