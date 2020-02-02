export class StyleRule {
    public readonly name: string;
    public readonly value: any;

    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }

    public toJssString(): string {
        return `"${this.name}":"${this.value}"`;
    }
}
