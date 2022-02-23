import { IWidgetOrder, IWidgetHandler } from "../editing";

export interface IWidgetService {
    /**
     * Returns the orders of registered widgets.
     */
    getWidgetOrders(): Promise<IWidgetOrder[]>;

    /**
     * Returns widget handler of the specified type.
     * @param type 
     */
    getWidgetHandler(type: IWidgetHandler): IWidgetHandler;

    /**
     * Registers specified widget handler.
     * @param handler 
     */
    registerWidgetHandler(handler: IWidgetHandler): void;
}