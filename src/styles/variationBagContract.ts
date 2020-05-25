import { VariationContract } from "./variationContract";

export interface VariationBagContract {
    /**
     * Variation name, e.g. "primary".
     */
    [variationName: string]: VariationContract;
}
