import { PluginBag } from "./pluginBagContract";
import { Bag } from "../bag";

/**
 * Style definition serves as a template for creating managed style structure.
 */
export interface StyleDefinition {
    /**
     * Style display name, e.g. `Button`.
     */
    displayName: string;

    /**
     * e.g. `hover`, `active`.
     */
    states?: string[];

    /**
     * Child component style definitions.
     */
    components?: Bag<StyleDefinition>;

    /**
     * Plugins the Style editor allowed to use, e.g. `margin`, `padding`.
     */
    plugins: string[];

    /**
     * Default styles.
     */
    defaults?: PluginBag;
}
