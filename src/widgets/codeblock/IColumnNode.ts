import { Contract } from "../../editing/contentNode";

export interface IDimensionalValues {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
}

export interface IColumnNode extends Contract {
    size?: IDimensionalValues;
    alignment?: IDimensionalValues;
}