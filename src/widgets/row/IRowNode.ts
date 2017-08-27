import { Contract } from "./../../editing/contentNode";

export interface IDimensionalValues {
    sm?: string;
    md?: string;
    lg?: string;
}

export interface IRowNode extends Contract {
    justify?: IDimensionalValues;
    align?: IDimensionalValues;
}