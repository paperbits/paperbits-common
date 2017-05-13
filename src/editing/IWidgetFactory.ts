
export interface IWidgetFactory {
    // Factory probably might attach behavior, i.e. update dispatching
    getWidgetInstance<T>(widgetComponentName: string, model: T): Promise<HTMLElement>;

    //getWidgetInstanceFromOrder<T>(order: IOrder): Promise<HTMLElement>;
}

export class KnockoutWidgetFactory implements IWidgetFactory {
    public getWidgetInstance<T>(widgetComponentName: string, model: T): Promise<HTMLElement> {
        let htmlElement = document.createElement(widgetComponentName);

        ko.applyBindingsToNode(htmlElement, {});

        return Promise.resolve(htmlElement);
    }
}