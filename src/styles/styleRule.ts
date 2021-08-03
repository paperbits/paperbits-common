/**
 * Style rule.
 */
export class StyleRule {
    public readonly name: string;
    public readonly value: any;
    public readonly fallback: boolean;

    /**
     * Style rule.
     * @param name {string} Style rule name, i.e. `background-color`.
     * @param value {string} Style rule value, i.e. `#ffffff`.
     * @param fallback {boolean} Indicates that this is a fallback rule.
     */
    constructor(name: string, value: any, fallback: boolean = false) {
        this.name = name;
        this.value = value;
        this.fallback = fallback;
    }

    public toJssString(): string {
        return `"${this.name}":"${this.value}"`;
    }
}
