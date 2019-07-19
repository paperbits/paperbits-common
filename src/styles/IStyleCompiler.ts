import { StyleContract } from "./styleConfig";
import { Style } from "./styles";

export interface StyleModel {
    key: string;
    classNames: string;
    css: string;
}


/**
 * A utility for compiling style definitions.
 */
export interface IStyleCompiler {
    /**
     * Returns class name(s) by color style key.
     * @param colorKey {string} Unique style identifier.
     */
    getClassNameByColorKey(colorKey: string): string;

    /**
     * Returns CSS class name(s) for style key.
     * @param key {string} Unique style identifier.
     */
    getClassNameByStyleKeyAsync(key: string): Promise<string>;
    
    /**
     * Returns CSS class name(s) for style contract.
     * @param styleConfig 
     */
    getClassNamesByStyleConfigAsync(styleConfig: StyleContract): Promise<string>;

    /**
     * Converts variation style contract into style model.
     * @param styleConfig 
     */
    getStyleModelAsync(styleConfig: StyleContract): Promise<StyleModel>;

    /**
     * Converts variation style contract into style.
     * @param variationStyleContract 
     * @param componentName 
     * @param variationName 
     */
    getVariationStyle(variationStyleContract: StyleContract, componentName: string, variationName?: string): Promise<Style>;
}