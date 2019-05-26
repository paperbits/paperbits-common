export interface Route {
    url: string;
    path: string;
    title?: string;
    metadata: Object;
    hash?: string;
    previous?: Route;
}
