import { Breakpoints } from "./breakpoints";

export interface StyleConfig {
    [category: string]: string | Breakpoints;
}

export interface IStyleService {
    getClassNameByStyleKey(key: string): string;
    getClassNamesByStyleConfig(styleConfig: StyleConfig): string;
}