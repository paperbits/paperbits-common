/**
 * Primitive definition.
 */
export interface PrimitiveContract {
    /**
     * Unique identifier.
     */
    key: string;

    /**
     * Display name.
     */
    displayName: string;
}

export interface LocalStyles {
    instance?: PluginBag;

    /**
     * Styles category, e.g. "appearance", "size", "instance".
     * Here, "appearance" and "size" are references to global styles, and "instance" is a bag of overriding styles.
     */
    [categoryName: string]: string | PluginBag;
}

export interface StatesContract extends PluginBag { }

export interface VariationsContract {
    /**
     * Variation name, e.g. "primary".
     */
    [variationName: string]: VariationContract;
}

export interface ComponentsContract {
    /**
     * Component, e.g. "button", "picture", etc.
     */
    [componentName: string]: VariationsContract;
}

/**
 * Bag of plugin configurations.
 */
export interface PluginBag {
    /**
     * Unique identifier;
     */
    key?: string;

    /**
     * Plugin, e.g. "padding", "margin", "typography", etc.
     */
    [pluginName: string]: any; //  StylePluginConfig;
}

export interface VariationContract extends PluginBag {
    /**
     * Unique identifier.
     */
    key: string;

    /**
     * Style display name.
     */
    displayName: string;

    /**
     * Style category, e.g. "appearance".
     */
    category?: string;

    /**
     * @deprecated. Allowed states, i.e. ["hover", "active"].
     */
    allowedStates?: string[];

    /**
     * Element states.
     */
    states?: StatesContract;

    /**
     * Nested component styles.
     */
    components?: ComponentsContract;
}