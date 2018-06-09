export class NavigationItemModel {
    public key: string;
    public label: string;
    public url: string;
    public permalinkKey: string;
    public nodes: NavigationItemModel[];
    public isActive: boolean;

    constructor() {
        this.nodes = [];
    }
}
