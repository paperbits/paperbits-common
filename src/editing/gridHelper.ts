import * as ko from "knockout";
import { IWidgetBinding, WidgetBinding } from "../editing";

export class GridHelper {
    private static getSelfAndParentBindings(element: HTMLElement): IWidgetBinding<any, any>[] {
        const context = ko.contextFor(element);

        if (!context) {
            return [];
        }

        const bindings: IWidgetBinding<any, any>[] = [];

        if (context.$data) {
            const widgetBinding = context.$data instanceof WidgetBinding
                ? context.$data // new
                : context.$data.widgetBinding; // legacy

            bindings.push(widgetBinding);
        }

        let current = null;

        context.$parents.forEach(viewModel => {
            if (viewModel && viewModel !== current) {
                bindings.push(viewModel["widgetBinding"]);
                current = viewModel;
            }
        });

        return bindings;
    }

    public static getParentWidgetBindings(element: HTMLElement): IWidgetBinding<any, any>[] {
        const bindings = [];
        const parentViewModels = GridHelper.getParentViewModels(element);

        parentViewModels.forEach(x => {
            const binding = x["widgetBinding"];

            if (binding) {
                bindings.push(binding);
            }
        });

        return bindings;
    }

    private static getParentViewModels(element: HTMLElement): any[] {
        const context = ko.contextFor(element);

        if (!context) {
            return [];
        }

        const viewModels = [];

        let current = context.$data;

        context.$parents.forEach(viewModel => {
            if (viewModel && viewModel !== current) {
                viewModels.push(viewModel);
                current = viewModel;
            }
        });

        return viewModels;
    }

    public static getParentWidgetBinding(element: HTMLElement): IWidgetBinding<any, any> {
        const viewModels = this.getParentViewModels(element);

        if (viewModels.length < 2) {
            return null;
        }

        const data = viewModels[1]; // first parent

        const widgetBinding = data instanceof WidgetBinding
            ? data // new model
            : data.widgetBinding; // legacy model

        return widgetBinding;
    }

    public static getWidgetBinding(element: HTMLElement): IWidgetBinding<any, any> {
        const bindings = this.getSelfAndParentBindings(element);

        if (bindings.length > 0) {
            return bindings[0];
        }
        else {
            return null;
        }
    }

    public static getModel(element: HTMLElement): any {
        const widgetBinding = GridHelper.getWidgetBinding(element);
        return widgetBinding?.model || null;
    }
}