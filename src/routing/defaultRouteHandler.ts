import { IEventManager } from "../events";
import { IRouteHandler } from "../routing";
import { IRouteChecker } from "./IRouteChecker";


export class RouteHandlerEvents {
    public static onRouteChange = "onRouteChange";
}

export class DefaultRouteHandler implements IRouteHandler {
    private metadata: Object;
    private routeCheckers: IRouteChecker[];
    private path: string;
    private hash: string;

    private originalPushState: (data, title: string, url: string) => void;

    public notifyListeners: boolean;

    constructor(
        private readonly eventManager: IEventManager
    ) {
        // initialization...
        this.eventManager = eventManager;
        this.routeCheckers = [];

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

    private pushState(data, title: string, url: string): void {
        const parts = url.split("#");

        this.path = parts[0];
        this.hash = parts.length > 1 ? parts[1] : "";

        this.originalPushState.call(history, data, title, url);

        if (this.notifyListeners) {
            this.eventManager.dispatchEvent(RouteHandlerEvents.onRouteChange);
        }
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

    public navigateTo(permalink: string, title: string = null, metadata: Object = null): void {
        if (!permalink) {
            return;
        }

        const isFullUrl = !permalink.startsWith("/");
        const isLocalUrl = permalink.startsWith(location.origin);

        if (isFullUrl && !isLocalUrl) {
            window.open(permalink, "_blank"); // navigating external link
            return;
        }

        const path = isFullUrl
            ? permalink.substring(location.origin.length)
            : permalink;

        if (this.routeCheckers.length > 0) {
            this.runRouteChecks(path, metadata).then(navigatePath => {
                this.applyNavigation(navigatePath, title, metadata);
            });
        }
        else {
            this.applyNavigation(path, title, metadata);
        }
    }

    protected applyNavigation(path: string, title: string, metadata: Object) {
        this.metadata = metadata;
        this.pushState(null, title, path);
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