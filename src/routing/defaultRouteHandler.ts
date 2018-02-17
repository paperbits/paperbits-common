import { IEventManager } from "../events/IEventManager";
import { IRouteHandler } from "../routing/IRouteHandler";


export class RouteHandlerEvents {
    static onRouteChange = "onRouteChange";
}

export class DefaultRouteHandler implements IRouteHandler {
    private path: string;
    private notificationEnabled: boolean;

    constructor(
        private readonly eventManager: IEventManager
    ) {
        // initialization...
        this.eventManager = eventManager;

        // rebinding...
        this.getCurrentUrl = this.getCurrentUrl.bind(this);

        // setting up...
        this.path = "";
        this.notificationEnabled = true;

        addEventListener("popstate", () => this.navigateTo(location.pathname));
    }

    public addRouteChangeListener(eventHandler: (args?) => void): void {
        this.eventManager.addEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    public removeRouteChangeListener(eventHandler: (args?) => void): void {
        this.eventManager.removeEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    public navigateTo(url: string, notifyListeners: boolean = true): void {
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

        if (path === this.path) {
            return;
        }

        if (!notifyListeners) {
            this.notificationEnabled = false;
        }

        this.path = path;

        history.pushState(null, null, path);

        if (this.notificationEnabled) {
            this.eventManager.dispatchEvent(RouteHandlerEvents.onRouteChange);
        }

        setImmediate(() => {
            this.notificationEnabled = true;
        })
    }

    public getCurrentUrl(): string {
        let permalink = this.path;

        if (permalink === "") {
            permalink = location.pathname;
        }

        return permalink;
    }
}