export class NavbarItemModel {
    public key: string;
    public label: string;
    public url: string;
    public permalinkKey: string;
    public nodes: NavbarItemModel[];
    public isActive: boolean;

    constructor() {
        this.nodes = [];
    }
}
