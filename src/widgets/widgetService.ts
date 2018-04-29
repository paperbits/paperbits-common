import { IBlobStorage } from '../persistence/IBlobStorage';
import { IWidgetService } from '../widgets/IWidgetService';
import { IWidgetHandler } from '../editing/IWidgetHandler';
import { IWidgetOrder } from '../editing/IWidgetOrder';

export class WidgetService implements IWidgetService {
    private readonly widgetHandlers: Array<IWidgetHandler>;

    constructor(widgetHandlers: Array<IWidgetHandler>) {
        this.widgetHandlers = widgetHandlers;

        // rebinding...
        this.getWidgetOrders = this.getWidgetOrders.bind(this);
    }

    public async getWidgetOrders(): Promise<Array<IWidgetOrder>> {
        const widgetOrders = new Array<IWidgetOrder>();

        let tasks = this.widgetHandlers.map(async (handler: IWidgetHandler) => {
            let order = await handler.getWidgetOrder();
            widgetOrders.push(order);
        });

        await Promise.all(tasks);

        return widgetOrders;
    }
}
