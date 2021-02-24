import { Style } from "./styles";

export class StyleMediaQuery {
    public minWidth: number;
    public styles: Style[];
    public globalStyles: Style[];

    constructor(minWidth: number) {
        this.minWidth = minWidth;
        this.styles = [];
        this.globalStyles = [];
    }
}
