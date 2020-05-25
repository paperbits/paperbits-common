import { VariationBagContract } from "./variationBagContract";


export interface ComponentBagContract {
    /**
     * Component, e.g. "button", "picture", etc.
     */
    [componentName: string]: VariationBagContract;
}
