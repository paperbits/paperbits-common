import * as Utils from "../utils";
import { StyleRule } from "./styleRule";
import { StyleMediaQuery } from "./styleMediaQuery";

export class Style {
    private readonly rules: StyleRule[];

    public readonly selector: string;
    public readonly nestedStyles: Style[];
    public readonly nestedGlobalStyles: Style[];
    public readonly modifierStyles: Style[];
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

    public getRulesJssString(): string {
        const rules = this.rules.filter(x => !!x.value).map(rule => rule.toJssString()).filter(x => !!x).join(",");
        const modifierStyles = this.modifierStyles.map(style => `"&.${style.selector}": ${style.getRulesJssString()}`).filter(x => !!x).join(",");
        const pseudoStyles = this.pseudoStyles.map(style => `"&:${style.selector}": ${style.getRulesJssString()}`).filter(x => !!x).join(",");
        const nestedStyles = this.nestedStyles.map(style => `"& .${style.selector}": ${style.getRulesJssString()}`).filter(x => !!x).join(",");
        const nestedGloablStyles = this.nestedGlobalStyles.map(style => `"& ${style.selector}": ${style.getRulesJssString()}`).filter(x => !!x).join(",");
        const jssString = `{ ${[rules, modifierStyles, pseudoStyles, nestedStyles, nestedGloablStyles /*, nestedMediaQueries*/].filter(x => !!x).join(",")} }`;

        return jssString;
    }

    public toJssString(): string {
        const rulesJssString = this.getRulesJssString();
        const jssString = `"${this.selector}":${rulesJssString}`;

        return jssString;
    }
}

