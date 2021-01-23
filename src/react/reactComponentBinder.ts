import * as React from "react";
import * as ReactDOM from "react-dom";
import { ComponentBinder } from "../editing/componentBinder";
import { WidgetBinding } from "../editing/widgetBinding";

export class ReactComponentBinder implements ComponentBinder {
    public init(element: Element, binding: WidgetBinding<any, any>): void {
        const reactElement = React.createElement(binding.viewModelClass, {} /* model? */);
        const viewModelInstance = ReactDOM.render(reactElement, element);
        binding.viewModel = viewModelInstance;

        if (binding.onCreate) {
            binding.onCreate(viewModelInstance);
        }
    }

    public dispose(element: Element, binding: WidgetBinding<any, any>): void {
        if (binding.onDispose) {
            binding.onDispose();
        }
    }
}