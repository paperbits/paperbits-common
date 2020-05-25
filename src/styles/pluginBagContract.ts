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