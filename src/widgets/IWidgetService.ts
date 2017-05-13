import { IWidgetOrder } from '../editing/IWidgetOrder';

export interface IWidgetService {
    getWidgetOrders(): Promise<Array<IWidgetOrder>>;
}