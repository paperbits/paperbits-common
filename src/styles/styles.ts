import * as Utils from "../utils";
import { BreakpointValues } from "./breakpoints";

export class StyleRule {
    public name: string;
    public value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }

    public toJssString(): string {
        return `"${this.name}":"${this.value}"`;
    }
}

export class StyleMediaQuery {
    public minWidth: number;
    public styles: Style[];

    constructor(minWidth: number) {
        this.minWidth = minWidth;
        this.styles = [];
    }

    public toJssString(): string {
        const styles = this.styles.map(style => style.toJssString()).join();
        return `"@media(min-width:${this.minWidth}px)":{${styles}}`;
    }
}

export class FontFace {
    public fontFamily: string;
    public src: string;
    public fontStyle: string;
    public fontWeight: number | string;

    public toJssString(): string {
        const jssString = `{
            "src": "url(${this.src})",
            "fontFamily": "${this.fontFamily}",
            "fontStyle": "${this.fontStyle}",
            "fontWeight": "${this.fontWeight}"
        }`;

        return jssString;
    }
}

export class Style {
    public readonly selector: string;
    public readonly rules: StyleRule[];
    public readonly nestedStyles: Style[];
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
        this.modifierStyles = [];
        this.pseudoStyles = [];
        this.nestedMediaQueries = [];
    }

    public getRulesJssString(): string {
        const rules = this.rules.map(rule => rule.toJssString()).filter(x => !!x).join(",");
        const modifierStyles = this.modifierStyles.map(style => `"&.${style.selector}": ${style.getRulesJssString()}`).filter(x => !!x).join(",");
        const pseudoStyles = this.pseudoStyles.map(style => `"&:${style.selector}": ${style.getRulesJssString()}`).filter(x => !!x).join(",");
        const nestedStyles = this.nestedStyles.map(style => `"& .${style.selector}": ${style.getRulesJssString()}`).filter(x => !!x).join(",");
        const jssString = `{ ${[rules, modifierStyles, pseudoStyles, nestedStyles /*, nestedMediaQueries*/].filter(x => !!x).join(",")} }`;

        return jssString;
    }

    public toJssString(): string {
        const rulesJssString = this.getRulesJssString();
        const jssString = `"${this.selector}":${rulesJssString}`;

        return jssString;
    }
}

export class StyleSheet {
    public styles: Style[];
    public mediaQueries: StyleMediaQuery[];
    public fontFaces: FontFace[];

    constructor() {
        this.styles = [];
        this.mediaQueries = [];
        this.fontFaces = [];
    }

    private flattenMediaQueries(styles: Style[]): StyleMediaQuery[] {
        const nestedMediaQueries = styles.map(x => x.nestedMediaQueries);
        const flattenNestedMediaQueries = nestedMediaQueries.reduce((acc, next) => acc.concat(next), []);
        const groupedMediaQueries = [];

        for (const breakpointMinWidth of Object.values(BreakpointValues)) {
            const mediaQuery = new StyleMediaQuery(breakpointMinWidth);
            flattenNestedMediaQueries
                .filter(x => x.minWidth === breakpointMinWidth)
                .forEach(x => mediaQuery.styles.push(...x.styles));

            groupedMediaQueries.push(mediaQuery);
        }

        return groupedMediaQueries;
    }

    public toJssString(): string {
        const fontFacesJssString = `"@font-face":[${this.fontFaces.map(x => x.toJssString()).join(",")}]`;
        const stylesJssString = this.styles.map(style => style.toJssString()).filter(x => !!x).join(",");
        const mediaQueries = this.flattenMediaQueries(this.styles);
        const mediaQueriesJssString = mediaQueries.map(x => x.toJssString()).filter(x => !!x).join(",");
        const result = [fontFacesJssString, stylesJssString, mediaQueriesJssString].filter(x => !!x).join(",");

        return `{${result}}`;
    }
}