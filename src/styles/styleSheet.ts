import { BreakpointValues } from "./breakpoints";
import { StyleMediaQuery } from "./styleMediaQuery";
import { Style } from "./styles";
import { FontFace } from "./FontFace";


export class StyleSheet {
    public readonly key: string;
    public readonly styles: Style[];
    public readonly globalStyles: Style[];
    public readonly mediaQueries: StyleMediaQuery[];
    public readonly fontFaces: FontFace[];

    constructor(key?: string) {
        this.key = key;
        this.styles = [];
        this.globalStyles = [];
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
