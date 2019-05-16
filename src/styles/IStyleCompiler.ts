import { StyleConfig } from "./styleConfig";

export interface StyleCompilation {
    classNames: string;
    css: string;
}

export interface IStyleCompiler {
    getClassNameByStyleKey(key: string): string;
    getClassNamesByStyleConfig(styleConfig: StyleConfig): string;
    getClassNameByColorKey(colorKey: string): string;
    getClassNameByStyleKeyAsync(key: string): Promise<string>;
    getClassNamesByStyleConfigAsync(styleConfig: StyleConfig): Promise<string>;
    getClassNamesByStyleConfigAsync2(styleConfig: StyleConfig): Promise<StyleCompilation>;
    getVariationClasses(variationConfig: StyleConfig, componentName: string, variationName?: string, isNested?: boolean): Promise<object>;
    jssToCss?(jssObject: object): string;
    getVariationClassNames(variationConfig: StyleConfig, componentName: string, variationName?: string): string[];
}