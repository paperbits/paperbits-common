export class NavigationItemModel {
    public key: string;
    public label: string;
    public targetKey: string;
    public targetUrl?: string;
    public nodes: NavigationItemModel[];
    public isActive?: boolean;

    constructor() {
        this.nodes = [];
    }
}
