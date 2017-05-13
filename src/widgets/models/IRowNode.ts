import { ContentConfig } from "./../../editing/contentNode";

export interface IDimensionalValues {
    sm?: string;
    md?: string;
    lg?: string;
}

export interface IRowNode extends ContentConfig {
    justify?: IDimensionalValues;
    align?: IDimensionalValues;
}