import * as ko from "knockout";
import * as Arrays from "../arrays";
import { IWidgetBinding, WidgetBinding, GridItem } from "../editing";

export class GridHelper {

    private static getSelfAndParentElements(element: HTMLElement): HTMLElement[] {
        const stack = [];

        while (element) {
            stack.push(element);
            element = element.parentElement;
        }

        return stack;
    }

    public static getGridItem(element: HTMLElement, includeReadonly: boolean = false): GridItem {
        const context = ko.contextFor(element);

        if (!context) {
            return null;
        }

        const widgetBinding = context.$data instanceof WidgetBinding
            ? context.$data
            : context.$data?.widgetBinding;

        if (!widgetBinding) {
            return null;
        }

        if (widgetBinding.readonly && !includeReadonly) {
            return null;
        }

        const gridItem: GridItem = {
            element: element,
            binding: widgetBinding,
            getParent: () => GridHelper.getParentGridItem(gridItem),
            getChildren: () => GridHelper.getChildGridItems(gridItem),
            getSiblings: () => GridHelper.getSiblingGridItems(gridItem),
            getNextSibling: () => GridHelper.getNextSibling(gridItem),
            getPrevSibling: () => GridHelper.getPrevSibling(gridItem)
        };

        return gridItem;
    }

    public static getWidgetStack(element: HTMLElement): GridItem[] {
        const elements = this.getSelfAndParentElements(element);
        let lastAdded = null;
        const roots = [];

        elements.reverse().forEach(element => {
            const item = GridHelper.getGridItem(element);

            if (!item) {
                return;
            }

            if (lastAdded === item.binding) {
                return;
            }

            roots.push(item);

            lastAdded = item.binding;
        });

        return roots.reverse();
    }

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

        if (viewModels.length === 0) {
            return null;
        }

        const parentViewModel = viewModels[0];
        return parentViewModel["widgetBinding"];
    }

    public static getParentWidgetBindings(element: HTMLElement): IWidgetBinding<any, any>[] {
        const bindings = [];
        const parentViewModels = this.getParentViewModels(element);

        parentViewModels.forEach(x => {
            const binding = x["widgetBinding"];

            if (binding) {
                bindings.push(binding);
            }
        });

        return bindings;
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
        const widgetModel = GridHelper.getWidgetBinding(element);

        if (widgetModel && widgetModel["model"]) {
            return widgetModel["model"];
        }
        else {
            return null;
        }
    }

    public static getChildGridItems(gridItem: GridItem): GridItem[] {
        const childElements = Arrays.coerce<HTMLElement>(gridItem.element.children);

        return childElements
            .map(child => GridHelper.getGridItem(child))
            .filter(x => !!x && x.binding.model !== gridItem.binding.model);
    }

    public static getParentGridItem(gridItem: GridItem): GridItem {
        const stack = GridHelper.getWidgetStack(gridItem.element);

        return stack.length > 1
            ? stack[1]
            : null;
    }

    public static getSiblingGridItems(gridItem: GridItem): GridItem[] {
        const parent = GridHelper.getParentGridItem(gridItem);
        return GridHelper.getChildGridItems(parent);
    }

    public static getNextSibling(gridItem: GridItem): GridItem {
        const nextElement = <HTMLElement>gridItem.element.nextElementSibling;

        if (!nextElement) {
            return null;
        }

        return GridHelper.getGridItem(nextElement);
    }

    public static getPrevSibling(gridItem: GridItem): GridItem {
        const previousElement = <HTMLElement>gridItem.element.previousElementSibling;

        if (!previousElement) {
            return null;
        }

        return GridHelper.getGridItem(previousElement);
    }
}