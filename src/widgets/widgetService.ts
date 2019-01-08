import { IWidgetService } from "../widgets/IWidgetService";
import { IWidgetHandler } from "../editing/IWidgetHandler";
import { IWidgetOrder } from "../editing/IWidgetOrder";

export class WidgetService implements IWidgetService {
    constructor(private readonly widgetHandlers: IWidgetHandler[]) {
        // rebinding...
        this.getWidgetOrders = this.getWidgetOrders.bind(this);
    }

    public async getWidgetOrders(): Promise<IWidgetOrder[]> {
        const widgetOrders = new Array<IWidgetOrder>();

        const tasks = this.widgetHandlers.map(async (handler: IWidgetHandler) => {
            if (handler.getWidgetOrder) {
                const order = await handler.getWidgetOrder();
                widgetOrders.push(order);
            }
        });

        await Promise.all(tasks);

        return widgetOrders;
    }

    public getWidgetHandler(type: any): IWidgetHandler {
        return this.widgetHandlers.find(x => x instanceof type);
    }
}
