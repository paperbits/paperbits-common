export interface IRouteHandler {
    getCurrentUrl(): string;
    addRouteChangeListener(eventHandler: (args?) => void): void;
    removeRouteChangeListener(eventHandler: (args?) => void): void;
    navigateTo(hash: string, notifyListeners?: boolean, forceNotification?: boolean): void;
}