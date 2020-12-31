import * as React from "react";
import * as ReactDOM from "react-dom";
import { ComponentBinder } from "../editing/componentBinder";
import { WidgetBinding } from "../editing/widgetBinding";

export class ReactComponentBinder implements ComponentBinder {
    public init(element: Element, binding: WidgetBinding): void {
        const reactElement = React.createElement(binding.viewModelClass, {} /* model? */);
        const viewModelInstance = ReactDOM.render(reactElement, element);
        binding.viewModelInstance = viewModelInstance;
        binding.applyChanges(binding.model);
    }

    public dispose(element: Element, binding: WidgetBinding): void {
        binding.dispose(binding.model);
    }
}