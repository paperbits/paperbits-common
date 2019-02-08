import { StyleConfig } from "./styleConfig";

export interface IStyleCompiler {
    getClassNameByStyleKey(key: string): string;
    getClassNamesByStyleConfig(styleConfig: StyleConfig): string;
    getClassNameByColorKey(colorKey: string): string;
    getClassNameByStyleKeyAsync(key: string): string;
    getClassNamesByStyleConfigAsync(styleConfig: StyleConfig): string;
 }