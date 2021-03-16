export class FontFace {
    /**
     * Font family name, e.g. `Quick Sand`.
     */
    public fontFamily: string;

    /**
     * Font face source file, e.g. `/fonts/QuickSand-Regular.ttf`.
     */
    public source: string;

    /**
     * Font face attributed style, e.g. `italic`.
     */
    public fontStyle: string;

    /**
     * Font face attributed weight, e.g. `bold`.
     */
    public fontWeight: number | string;
}
