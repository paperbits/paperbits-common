import { StyleMediaQuery } from "./styleMediaQuery";
import { Style } from "./styles";
import { FontFace } from "./fontFace";


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
}
