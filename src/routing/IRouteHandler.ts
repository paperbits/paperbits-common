export interface IRouteHandler {
    getCurrentUrl(): string;
    addRouteChangeListener(callback: () => void): void;
    removeRouteChangeListener(handle: any): void;
    navigateTo(hash: string, notifyListeners?: boolean, forceNotification?: boolean): void;
}