import { Bag } from "..";

/**
 * Route.
 */
export interface Route {
    /**
     * Full route URL that consists of path and hash, e.g. "/about#param".
     */
    url: string;

    /**
     * URL fragment before hash part, e.g. "/about".
     */
    path: string;

    /**
     * URL fragment after path, e.g. "#param".
     */
    hash?: string;

    /**
     * Route title.
     */
    title?: string;

    /**
     * Additional data associate with the route.
     */
    metadata: Bag<any>;
    
    /**
     * Previous route.
     */
    previous?: Route;
}
