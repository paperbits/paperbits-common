export class NavbarItemModel {
    public label: string;
    public url: string;
    public nodes: NavbarItemModel[];
    public isActive: boolean;

    constructor() {
        this.nodes = [];
    }
}
