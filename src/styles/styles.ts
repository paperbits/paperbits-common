import * as Utils from "../utils";
import { StyleRule } from "./styleRule";
import { StyleMediaQuery } from "./styleMediaQuery";

export class Style {
    public readonly rules: StyleRule[];
    public selector: string;
    public nestedStyles: Style[];
    public readonly nestedGlobalStyles: Style[];
    public modifierStyles: Style[];
    public readonly pseudoStyles: Style[];
    public readonly nestedMediaQueries: StyleMediaQuery[];

    // descendant selector (space)
    // child selector (>)
    // adjacent sibling selector (+)
    // general sibling selector (~)

    constructor(selector: string) {
        this.selector = Utils.camelCaseToKebabCase(selector);
        this.rules = [];
        this.nestedStyles = [];
        this.nestedGlobalStyles = [];
        this.modifierStyles = [];
        this.pseudoStyles = [];
        this.nestedMediaQueries = [];
    }

    public addRule(rule: StyleRule): void {
        this.rules.push(rule);
    }

    public addRules(rules: StyleRule[]): void {
        this.rules.push(...rules);
    }
}

