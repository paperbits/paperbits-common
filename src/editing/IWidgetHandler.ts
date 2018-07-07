import { IWidgetOrder } from "../editing/IWidgetOrder";

export interface IWidgetHandler {
    getWidgetOrder(): Promise<IWidgetOrder>;
}
