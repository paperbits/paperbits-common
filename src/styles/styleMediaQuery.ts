import { Style } from "./styles";

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
