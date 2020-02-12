import { PrimitiveContract } from ".";

export interface Styleable {
    style: PrimitiveContract;
    toggleBackground: () => void;
}