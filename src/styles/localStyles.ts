import { PluginBag } from "./pluginBagContract";

/**
 * Local styles applied to an instance of a widget.
 */
export interface LocalStyles {
    /**
     * Bag of style plugins associates to a particular instance of a widget.
     */
    instance?: PluginBag;

    /**
     * Styles category, e.g. "appearance", "size", "instance".
     * Here, "appearance" and "size" are references to global styles, and "instance" is a bag of overriding styles.
     */
    [categoryName: string]: string | PluginBag;
}
