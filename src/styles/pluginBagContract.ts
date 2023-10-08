/**
 * Bag of plugin configurations.
 */
export interface PluginBag {
    /**
     * Plugin, e.g. "padding", "margin", "typography", etc.
     */
    [pluginName: string]: any; //  StylePluginConfig;
}