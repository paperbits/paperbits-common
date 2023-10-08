import { VariationBagContract } from "./variationBagContract";
import { VariationContract } from "./variationContract";

export interface StyleHandler {
    key: string;
    migrate?: (style: VariationBagContract) => void;
    getDefaultStyle?: (key?: string) => VariationContract;
}