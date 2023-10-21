import { PrimitiveContract } from ".";

export interface Styleable {
    key?: string;
    style?: PrimitiveContract;
    toggleBackground?: () => void;
    setState?: (state: string) => void;
    applyChanges?: () => void;
}