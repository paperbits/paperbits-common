import { LocalStyles, StatesContract, StyleContract } from "./styleContract";
import { StyleModel } from "./styleModel";
import { Style } from "./styles";


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
     * @param contract {StyleContract} Style contract.
     */
    getStyleModelAsync(contract: LocalStyles): Promise<StyleModel>;

    /**
     * Converts variation style contract into style.
     * @param contract {StyleContract} Variation style contract.
     * @param componentName {string} Component name, e.g. "button".
     * @param variationName {string} Style variation name, e.g. "primary".
     */
    getVariationStyle(contract: StyleContract, componentName: string, variationName?: string): Promise<Style>;

    /**
     * Returns compiled font styles.
     */
    getFontsStylesCss(): Promise<string>;

    /**
     * Converts states style contract into style.
     * @param states {StatesContract} Bag of state contracts.
     * @param stateName {string} Name of the state, e.g. "hover", "active".
     */
    getStateStyle(states: StatesContract, stateName: string): Promise<Style>;

    /**
     * Return compiled theme styles.
     */
    compileCss(): Promise<string>;

    setStyles(styles: any): void;
}