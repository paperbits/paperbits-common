import * as Array from "@paperbits/common";
import { Keys } from "@paperbits/common";
import { Events } from "@paperbits/common/events";
import { AriaAttributes, AriaRoles, Attributes } from "../html";
import { BehaviorHandle } from "./behavior";

const selectedClassName = "selected";
const optionElementSelector = "[role=option]:not([disabled])";
const selectedOptionElementSelector = `[${AriaAttributes.selected}]`;
const defaultTabIndex = "0";


export interface ListboxOptions {
    onSelect: (selectedElement: HTMLElement) => void; // Changed from unknown to HTMLElement
}

export class ListboxBehavior {
    public static attach(listboxElement: HTMLElement, config: ListboxOptions): BehaviorHandle {
        let activeItemIndex: number;

        if (listboxElement.getAttribute(Attributes.Role) !== AriaRoles.Listbox) {
            console.warn(`List and its child elements should have role="listbox" and role="option" attributes respectively.`);
            return;
        }

        listboxElement.setAttribute(Attributes.TabIndex, defaultTabIndex);

        const getOptionElements = (): HTMLElement[] => {
            return Array.coerce<HTMLElement>(listboxElement.querySelectorAll(optionElementSelector));
        };

        const getActiveOptionElement = (): HTMLElement => {
            const optionElements = getOptionElements();
            const activeOptionElement = optionElements.find(x => x.getAttribute(Attributes.TabIndex) === defaultTabIndex);

            return activeOptionElement;
        };

        const getSelectedOptionElement = (): HTMLElement => {
            const selectedOptionElement = <HTMLElement>listboxElement.querySelector(selectedOptionElementSelector);
            return selectedOptionElement;
        };

        const setActiveOption = (optionIndex: number): void => {
            const optionElements = getOptionElements();
            const currentActiveOption = optionElements.find(element => !!element.getAttribute(Attributes.TabIndex));

            if (currentActiveOption) {
                currentActiveOption.removeAttribute(Attributes.TabIndex);
            }

            const activeOption = optionElements[optionIndex];
            activeOption.setAttribute(Attributes.TabIndex, defaultTabIndex);
            activeOption.focus();

            activeItemIndex = optionIndex;
        };

        const onKeyDown = (event: KeyboardEvent): void => {
            const eventTarget = <HTMLElement>event.target;

            if (!listboxElement.contains(eventTarget) || !eventTarget.matches(optionElementSelector)) {
                return;
            }

            switch (event.key) {
                case Keys.ArrowRight:
                case Keys.ArrowDown:
                    event.preventDefault();

                    const nextIndex = activeItemIndex + 1;
                    const optionElements = getOptionElements();

                    if (nextIndex >= optionElements.length) {
                        return;
                    }

                    setActiveOption(nextIndex);

                    break;

                case Keys.ArrowLeft:
                case Keys.ArrowUp:
                    event.preventDefault();

                    const prevIndex = activeItemIndex - 1;

                    if (prevIndex < 0) {
                        return;
                    }

                    setActiveOption(prevIndex);

                    break;

                case Keys.Enter:
                case Keys.Space:
                    const selectedOptionElement = getSelectedOptionElement();

                    if (selectedOptionElement) {
                        selectedOptionElement.removeAttribute(AriaAttributes.selected);
                        selectedOptionElement.classList.remove(selectedClassName);
                    }

                    const activeOptionElement = getActiveOptionElement();
                    activeOptionElement.setAttribute(AriaAttributes.selected, "true");
                    activeOptionElement.classList.add(selectedClassName);

                    if (config.onSelect) {
                        // config.onSelect(ko.dataFor(activeOptionElement)); // Removed ko.dataFor
                        config.onSelect(activeOptionElement); // Pass the element itself
                    }

                    break;
            }
        };

        const onContainerElementFocus = (): void => {
            const optionElements = getOptionElements();

            if (optionElements.length === 0) {
                return;
            }

            const activeOptionElement = optionElements.find(x => x.getAttribute(Attributes.TabIndex) === defaultTabIndex);

            if (activeOptionElement) {
                activeOptionElement.focus();
                return;
            }

            activeItemIndex = 0;
            setActiveOption(activeItemIndex);
        };

        const onGlobalFocusChange = (event: KeyboardEvent): void => {
            const eventTarget = <HTMLElement>event.target;

            if (listboxElement.contains(eventTarget)) {
                listboxElement.removeAttribute(Attributes.TabIndex);
            }
            else {
                listboxElement.setAttribute(Attributes.TabIndex, defaultTabIndex);
            }
        };

        const onMouseDown = (event: MouseEvent): void => {
            const eventTarget = <HTMLElement>event.target;
            const optionElement = <HTMLElement>eventTarget.closest(optionElementSelector);

            if (!optionElement) {
                return;
            }

            const optionElements = Array.coerce<HTMLElement>(listboxElement.querySelectorAll(optionElementSelector));
            const activeItemIndex = optionElements.indexOf(optionElement);
            setActiveOption(activeItemIndex);

            if (config.onSelect) {
                event.preventDefault();
                event.stopImmediatePropagation();

                // config.onSelect(ko.dataFor(optionElement)); // Removed ko.dataFor
                config.onSelect(optionElement); // Pass the element itself
            }
        };

        listboxElement.addEventListener(Events.MouseDown, onMouseDown, true);
        listboxElement.addEventListener(Events.KeyDown, onKeyDown, true);
        listboxElement.addEventListener(Events.Focus, onContainerElementFocus);
        document.addEventListener(Events.Focus, onGlobalFocusChange, true);

        const handle: BehaviorHandle = {
            detach: () => {
                listboxElement.removeEventListener(Events.MouseDown, onMouseDown, true);
                listboxElement.removeEventListener(Events.KeyDown, onKeyDown, true);
                listboxElement.removeEventListener(Events.Focus, onContainerElementFocus);
                document.removeEventListener(Events.Focus, onGlobalFocusChange, true);
            }
        }

        return handle;
    }
}