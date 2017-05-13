export interface IRouteHandler {
    getCurrentUrl(): string;
    addRouteChangeListener(callback: () => void): any;
    removeRouteChangeListener(handle: any);
    navigateTo(hash: string, notifyListeners?: boolean, forceNotification?: boolean);
}