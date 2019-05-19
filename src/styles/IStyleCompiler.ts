import { StyleContract } from "./styleConfig";

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
    getClassNamesByStyleConfigAsync2(styleConfig: StyleContract): Promise<StyleModel>;
    getVariationClasses(variationConfig: StyleContract, componentName: string, variationName?: string, isNested?: boolean): Promise<object>;
    jssToCss?(jssObject: object): string;
    getVariationClassNames(variationConfig: StyleContract, componentName: string, variationName?: string): string[];
}