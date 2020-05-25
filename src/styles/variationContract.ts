import { PluginBag } from "./pluginBagContract";
import { StateBagContract } from "./stateBagContract";
import { ComponentBagContract } from "./componentBagContract";

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
    states?: StateBagContract;
    
    /**
     * Nested component styles.
     */
    components?: ComponentBagContract;
}
