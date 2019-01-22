import { Breakpoints } from "./breakpoints";

export interface StyleConfig {
    [category: string]: string | Breakpoints;
}