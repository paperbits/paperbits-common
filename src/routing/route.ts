import { Bag } from "..";

export interface Route {
    url: string;
    path: string;
    title?: string;
    metadata: Bag<any>;
    hash?: string;
    previous?: Route;
}
