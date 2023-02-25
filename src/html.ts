import * as Arrays from "./arrays";

/**
 * Returns closest element that satisfies the predicate, going from child to parent.
 * @param node {Node} Node from which the search starts.
 * @param predicate {(node: Node) => boolean} Search predicate
 */
export function closest(node: Node, predicate: (node: Node) => boolean): Node {
    do {
        if (predicate(node)) {
            return node;
        }

        node = node.parentNode;
    }
    while (node);
}

/**
 * Returns first element that satisfies the predicate, going from parent to children.
 * @param node {Node} Node from which the search starts.
 * @param predicate {(node: Node) => boolean} Search predicate
 * @returns 
 */
export function findFirst(node: Node, predicate: (node: Node) => boolean): Node {
    if (predicate(node)) {
        return node;
    }

    const childNodes = Arrays.coerce<Node>(node.childNodes);

    for (const childNode of childNodes) {
        const childNodeMeetingCriteria = findFirst(childNode, predicate);

        if (childNodeMeetingCriteria) {
            return childNodeMeetingCriteria;
        }
    }

    return null;
}

/**
 * Returns a stack of ancestors of specified starting element.
 * @param element - Starting element.
 */
export function parents(element: HTMLElement): HTMLElement[] {
    const stack = selfAndParents(element);

    if (stack.length > 1) {
        return stack.slice(1);
    }

    return [];
}

/**
 * Returns a stack of ancestor elements and the specified starting element itself.
 * @param element - Starting element.
 */
export function selfAndParents(element: HTMLElement): HTMLElement[] {
    const stack = [];

    while (element) {
        stack.push(element);
        element = element.parentElement;
    }

    return stack;
}

/**
 * Determines if the element is actually visible, regardless of it's presence in the document.
 * @param element - An element being checked.
 */
export function isVisible(element: HTMLElement): boolean {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
};

/**
 * Returns a collection of focusable element hosted by specified element.
 * @param element - Host element.
 */
export function getFocusableElements(element: HTMLElement): HTMLElement[] {
    return Arrays.coerce<HTMLElement>(element.querySelectorAll("*")).filter(x => x.tabIndex >= 0 && isVisible(x));
};

export enum AriaAttributes {
    /**
     * Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
     */
    expanded = "aria-expanded",

    /**
     * Defines a string value that labels the current element.
     */
    label = "aria-label",

    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     */
    controls = "aria-controls",

    /**
     * Indicates whether the element is exposed to an accessibility API.
     */
    hidden = "aria-hidden",

    /**
     * Indicates the current “selected” state of various widgets. See related aria-checked and aria-pressed.
     */
    selected = "aria-selected",

    /**
     * Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
     */
    hasPopup = "aria-haspopup",
}

export enum Attributes {
    Href = "href",
    Target = "target",
    Download = "download",
    TabIndex = "tabindex",
    Role = "role",
    Rel = "rel",
    Type = "type",
    Integrity = "integrity",
    ContentEditable = "contentEditable"
}

export enum DataAttributes {
    /**
     * Indicates type of togglable. Allowed values: `popup`,`dropdown`,`collapsible`.
     */
    Toggle = "data-toggle",

    /**
     * Indicates how the togglable gets triggered. Allowed values: `click`,`hover`,`focus`,`keydown`.
     */
    TriggerEvent = "data-trigger-event",

    /**
     * 
     */
    Target = "data-target",

    /**
     * 
     */
    Dismiss = "data-dismiss",

    /**
     * Indicates togglables auto-closing behavior. Allowed values: `true`,`inside`,`outside`,`false.`
     */
    AutoClose = "data-auto-close"
}

export enum AriaRoles {
    Listbox = "listbox",
    Option = "option"
}

/**
 * Hyperlink relationship between a linked resource and the current page.
 */
export enum HyperlinkRels {
    /**
     * Instructs the browser not to set `window.opener` property when opening a new window.
     */
    NoOpener = "noopener",

    /**
     * Instructs the browser not to send `Referrer` HTTP header when opening navigating to linked page.
     */
    NoReferrer = "noreferrer",

    /**
     * Indicates that the linked resource is not endorsed by the author.
     */
    NoFollow = "nofollow"
}