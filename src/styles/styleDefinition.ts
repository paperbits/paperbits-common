import { PluginBag } from "./pluginBagContract";
import { Bag } from "../bag";
import { LocalStyles } from "./localStyles";


export interface ColorStyleDefinition {
    /**
     * Color display name, e.g. `Button background`.
     */
    displayName: string;

    defaults: {
        /**
         * Color value, e.g. `#ffffff`.
         */
        value: string;
    };
}


export interface ComponentBagDefiniton {
    /**
     * Component, e.g. "button", "picture", etc.
     */
    [componentName: string]: ComponentStyleDefinition;
}


export interface ComponentStyleDefinition {
    /**
     * Style display name, e.g. `Button`.
     */
    displayName?: string;

    /**
     * A description to display in style editor or documentation components.
     */
    description?: string;

    /**
     * e.g. `hover`, `active`.
     */
    states?: string[];

    /**
     * Plugins the Style editor allowed to use, e.g. `margin`, `padding`.
     */
    plugins: string[];

    /**
     * Child component style definitions.
     */
    components?: ComponentBagDefiniton;

    /**
     * Default local styles. Default means what will be created if doesn't exist yet.
     * If the value exists, it means that we can't change it anymore, because a user could
     * changes it already and we would override it.
     */
    defaults?: LocalStyles;

    /**
     * Key of a global component style to use a base, i.e. `components/button`.
     */
    baseComponentKey?: string;
}


/**
 * Style definition serves as a template for creating managed style structure.
 */
export interface StyleDefinition {
    /**
     * Component style definitions.
     */
    components?: Bag<ComponentStyleDefinition>;

    /**
     * Color style defintions.
     */
    colors?: Bag<ColorStyleDefinition>;
}
