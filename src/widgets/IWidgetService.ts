import { IWidgetOrder, IWidgetHandler } from "../editing";

export interface IWidgetService {
    getWidgetOrders(): Promise<IWidgetOrder[]>;
    getWidgetHandler(type: any): IWidgetHandler;
}