// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Keys, MouseButtons } from "@paperbits/common";
import { Events } from "@paperbits/common/events";
import { BehaviorHandle } from "./behavior";

export class CollapseBehavior {
    public static attach(triggerElement: HTMLElement, targetSelector: string, expanded: boolean = true): BehaviorHandle {
        const targetElement = document.querySelector(targetSelector);

        if (!targetElement) {
            console.warn(`No element found for selector ${targetSelector}.`);
            return { detach: () => {} };
        }

        let isExpanded = expanded;

        if (!triggerElement.hasAttribute("aria-label")) {
            triggerElement.setAttribute("aria-label", "Toggle section");
        }

        triggerElement.setAttribute("role", "button");
        triggerElement.setAttribute("aria-expanded", isExpanded.toString());

        targetElement.setAttribute("role", "region");
        targetElement.setAttribute("aria-hidden", (!isExpanded).toString());
        
        if (!isExpanded) {
            targetElement.classList.add("collapsed");
        }
        else {
            targetElement.classList.remove("collapsed");
        }
        triggerElement.classList.toggle("collapsed", !isExpanded);


        const toggle = (): void => {
            isExpanded = !isExpanded;
            triggerElement.setAttribute("aria-expanded", isExpanded.toString());
            targetElement.setAttribute("aria-hidden", (!isExpanded).toString());
            targetElement.classList.toggle("collapsed", !isExpanded);
            triggerElement.classList.toggle("collapsed", !isExpanded);
        };

        const onPointerDown = (event: MouseEvent): void => {
            if (event.button !== MouseButtons.Main) {
                return;
            }
            toggle();
        };

        const onClick = (event: MouseEvent): void => {
            event.preventDefault();
            event.stopImmediatePropagation();
        };

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === Keys.Enter || event.key === Keys.Space) {
                toggle();
            }
        };

        triggerElement.addEventListener(Events.Click, onClick);
        triggerElement.addEventListener(Events.KeyDown, onKeyDown);
        triggerElement.addEventListener(Events.MouseDown, onPointerDown);

        return {
            detach: () => {
                triggerElement.removeEventListener(Events.Click, onClick);
                triggerElement.removeEventListener(Events.KeyDown, onKeyDown);
                triggerElement.removeEventListener(Events.MouseDown, onPointerDown);
            }
        };
    }
}