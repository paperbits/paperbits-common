import { StyleContract } from "./styleConfig";
import { Style } from "./styles";
import { StyleModel } from "./styleModel";


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
     * @param contract 
     */
    getClassNamesByStyleConfigAsync(contract: StyleContract): Promise<string>;

    /**
     * Converts style contract into style model.
     * @param contract {StyleContract} Style contract.
     */
    getStyleModelAsync(contract: StyleContract): Promise<StyleModel>;

    /**
     * Converts variation style contract into style.
     * @param contract {StyleContract} Variation style contract.
     * @param componentName {string} Component name, e.g. "button".
     * @param variationName {string} Style variation name, e.g. "primary".
     */
    getVariationStyle(contract: StyleContract, componentName: string, variationName?: string): Promise<Style>;
}