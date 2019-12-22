import { LocalStyles } from "../styles";

export interface WidgetModel {
    widgets?: WidgetModel[];
    styles?: LocalStyles;
}