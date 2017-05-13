import { ContentConfig } from "../../editing/contentNode";

export interface IDimensionalValues {
    sm?: string;
    md?: string;
    lg?: string;
}

export interface IColumnNode extends ContentConfig {
    size?: IDimensionalValues;
    alignment?: IDimensionalValues;
}