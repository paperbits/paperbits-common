import { LocalStyles } from "../styles";

export interface WidgetModel {
    widgets?: WidgetModel[];
    styles?: LocalStyles;
}

export interface ContainerWidgetModel extends WidgetModel {
    widgets?: WidgetModel[];
}