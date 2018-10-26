import { IEventManager } from "../events";
import { IRouteHandler } from "../routing";
import { IRouteChecker } from "./IRouteChecker";


export class RouteHandlerEvents {
    public static onRouteChange = "onRouteChange";
}

export class DefaultRouteHandler implements IRouteHandler {
    protected path: string;
    protected metadata: Object;
    protected routeCheckers: IRouteChecker[];
    protected topWindow: Window;

    public notifyListeners: boolean;

    constructor(
        private readonly eventManager: IEventManager
    ) {
        // initialization...
        this.eventManager = eventManager;
        this.routeCheckers = [];
        this.topWindow = window.parent || window; /* Hack to cover both design- and runtime */

        // rebinding...
        this.getCurrentUrl = this.getCurrentUrl.bind(this);

        // setting up...
        this.path = "";
        this.notifyListeners = true;

        addEventListener("popstate", () => this.navigateTo(this.topWindow.location.pathname));
    }

    public addRouteChangeListener(eventHandler: (args?) => void): void {
        this.eventManager.addEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    public removeRouteChangeListener(eventHandler: (args?) => void): void {
        this.eventManager.removeEventListener(RouteHandlerEvents.onRouteChange, eventHandler);
    }

    public addRouteChecker(routeChecker: IRouteChecker) {
        if (routeChecker) {
            this.routeCheckers.push(routeChecker);
        }
    }

    public removeRouteChecker(routeCheckerName: string) {
        if (routeCheckerName) {
            const removeIndex = this.routeCheckers.findIndex(item => item.name === routeCheckerName);
            if (removeIndex !== -1) {
                this.routeCheckers.splice(removeIndex, 1);
            } else {
                console.log(`routeChecker with name '${routeCheckerName}' was not found`);
            }
        }
    }

    public navigateTo(url: string, metadata: Object = null): void {
        if (!url) {
            return;
        }

        const isFullUrl = !url.startsWith("/");
        const isLocalUrl = url.startsWith(this.topWindow.location.origin);

        if (isFullUrl && !isLocalUrl) {
            window.open(url, "_blank"); // navigating external link
            return;
        }

        const path = isFullUrl
            ? url.substring(this.topWindow.location.origin.length)
            : url;

        if (path === this.path && this.metadata === metadata) {
            return;
        }

        if (this.routeCheckers.length > 0) {
            this.runRouteChecks(path, metadata).then(navigatePath => {
                this.applyNavigation(navigatePath, metadata);
            })
        } else {
            this.applyNavigation(path, metadata);
        }
    }

    protected applyNavigation(path: string, metadata: Object) {
        this.metadata = metadata;

        if (path.contains("#")) {
            const parts = path.split("#");
            const pathname = parts[0];
            const hash = parts[1];

            if (pathname === this.topWindow.location.pathname) {
                return; // TODO: Figure out how to navigate anchors.
            }
        }

        this.path = path;

        this.topWindow.history.pushState(null, null, path);

        if (this.notifyListeners) {
            this.eventManager.dispatchEvent(RouteHandlerEvents.onRouteChange);
        }
    }

    protected async runRouteChecks(path: string, metadata?: Object): Promise<string> {
        const resultUrl = path;

        if (this.routeCheckers.length > 0) {
            for (const item of this.routeCheckers) {
                try {
                    const itemResult = await item.checkNavigatePath(path, metadata);

                    // if path can NOT be navigated and checker returned path for redirect  
                    if (itemResult !== resultUrl) {
                        return Promise.resolve(itemResult);
                    }
                }
                catch (error) {
                    throw new Error(`routeHandler checkNavigatePath item error: ${error}`);
                }
            }
        }
        return Promise.resolve(resultUrl);
    }

    public getCurrentUrl(): string {
        let permalink = this.path;

        if (permalink === "") {
            permalink = this.topWindow.location.pathname;
        }

        return permalink;
    }

    public getCurrentUrlMetadata(): Object {
        return this.metadata;
    }
}