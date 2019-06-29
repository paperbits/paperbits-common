import { StyleContract } from "./styleConfig";
import { Style } from "./styles";

export interface StyleModel {
    key: string;
    classNames: string;
    css: string;
}

export interface IStyleCompiler {
    getClassNameByStyleKey(key: string): string;
    getClassNamesByStyleConfig(styleConfig: StyleContract): string;
    getClassNameByColorKey(colorKey: string): string;
    getClassNameByStyleKeyAsync(key: string): Promise<string>;
    getClassNamesByStyleConfigAsync(styleConfig: StyleContract): Promise<string>;
    getStyleModelAsync(styleConfig: StyleContract): Promise<StyleModel>;
    getVariationStyle(variationConfig: StyleContract, componentName: string, variationName?: string, isNested?: boolean): Promise<Style>;
}