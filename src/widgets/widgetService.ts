import { IWidgetService } from "../widgets/IWidgetService";
import { IWidgetHandler } from "../editing/IWidgetHandler";
import { IWidgetOrder } from "../editing/IWidgetOrder";

export class WidgetService implements IWidgetService {
    constructor(private readonly widgetHandlers: IWidgetHandler[]) { }

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
        if (!type) {
            throw new Error(`Parameter "type" not specified.`);
        }

        return this.widgetHandlers.find(x => x instanceof type);
    }

    public registerWidgetHandler(handler: IWidgetHandler): void {
        if (!handler) {
            throw new Error(`Parameter "handler" not specified.`);
        }

        this.widgetHandlers.push(handler);
    }
}
