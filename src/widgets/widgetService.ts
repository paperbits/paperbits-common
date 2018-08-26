import { IWidgetService } from "../widgets/IWidgetService";
import { IWidgetHandler } from "../editing/IWidgetHandler";
import { IWidgetOrder } from "../editing/IWidgetOrder";

export class WidgetService implements IWidgetService {
    private readonly widgetHandlers: IWidgetHandler[];

    constructor(widgetHandlers: IWidgetHandler[]) {
        this.widgetHandlers = widgetHandlers;

        // rebinding...
        this.getWidgetOrders = this.getWidgetOrders.bind(this);
    }

    public async getWidgetOrders(): Promise<IWidgetOrder[]> {
        const widgetOrders = new Array<IWidgetOrder>();

        const tasks = this.widgetHandlers.map(async (handler: IWidgetHandler) => {
            const order = await handler.getWidgetOrder();
            widgetOrders.push(order);
        });

        await Promise.all(tasks);

        return widgetOrders;
    }
}
