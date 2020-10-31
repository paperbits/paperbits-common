import { StateBagContract } from "./stateBagContract";
import { LocalStyles } from "./localStyles";
import { VariationContract } from "./variationContract";
import { StyleModel } from "./styleModel";
import { Style, StyleSheet, StyleManager } from "./";


/**
 * A utility for compiling style definitions.
 */
export interface StyleCompiler {
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
     * Returns CSS class name(s) for local styles.
     * @param contract 
     */
    getClassNamesForLocalStylesAsync(contract: LocalStyles): Promise<string>;

    /**
     * Converts style contract into style model.
     * @param contract {VariationContract} Style contract.
     */
    getStyleModelAsync(contract: LocalStyles, styleManager?: StyleManager): Promise<StyleModel>;

    /**
     * Converts variation style contract into style.
     * @param contract {VariationContract} Variation style contract.
     * @param componentName {string} Component name, e.g. "button".
     * @param variationName {string} Style variation name, e.g. "primary".
     */
    getVariationStyle(contract: VariationContract, componentName: string, variationName?: string): Promise<Style>;

    /**
     * Returns compiled font styles.
     */
    getFontsStylesCss(): Promise<string>;

    /**
     * Converts states style contract into style.
     * @param states {StateBagContract} Bag of state contracts.
     * @param stateName {string} Name of the state, e.g. "hover", "active".
     */
    getStateStyle(states: StateBagContract, stateName: string): Promise<Style>;

    /**
     * Returns theme style sheet;
     */
    getStyleSheet(): Promise<StyleSheet>;

    /**
     * Returns compiled theme style sheet.
     */
    compileCss(): Promise<string>;

    setStyles(styles: any): void;

    getIconFontStylesCss(): Promise<string>;
}