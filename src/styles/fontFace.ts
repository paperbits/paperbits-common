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
