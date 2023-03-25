import { WidgetContext } from "../editing";
import { IComponent } from "./IComponent";
import { IContextCommand } from "./IContextCommandSet";

export const defaultCommandColor = "#607d8b";
export const switchToParentCommandLabel = `Switch to parent<div class="subtle">(Page up)</div>`;

export function switchToParentCommand(context: WidgetContext): IContextCommand {
    return {
        controlType: "toolbox-button",
        tooltip: switchToParentCommandLabel,
        iconClass: "paperbits-icon paperbits-enlarge-vertical",
        position: "top right",
        callback: () => context.switchToParent()
    };
}

export function openWidgetEditorCommand(context: WidgetContext, label: string = "Edit widget", tooltip?: string,): IContextCommand {
    return {
        controlType: "toolbox-button",
        displayName: label,
        tooltip: tooltip,
        position: "top right",
        callback: () => context.openWidgetEditor()
    }
}

export function openHelpArticleCommand(context: WidgetContext, articleKey: string): IContextCommand {
    return {
        controlType: "toolbox-button",
        tooltip: "Help",
        iconClass: "paperbits-icon paperbits-c-question",
        position: "top right",
        callback: () => {
            // 
        }
    }
}

export function deleteWidgetCommand(context: WidgetContext, tooltip: string = "Delete widget"): IContextCommand {
    return {
        controlType: "toolbox-button",
        tooltip: tooltip,
        callback: () => context.deleteWidget(),
    }
}

export function splitter(): IContextCommand {
    return {
        controlType: "toolbox-splitter"
    }
}
