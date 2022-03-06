import { PrimitiveContract } from ".";

export interface Styleable {
    key?: string;
    style?: PrimitiveContract;
    toggleBackground?: () => void;
    applyChanges?: () => void;
}