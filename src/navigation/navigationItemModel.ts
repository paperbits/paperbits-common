export class NavigationItemModel {
    public label: string;
    public url: string;
    public nodes: NavigationItemModel[];
    public isActive: boolean;

    constructor() {
        this.nodes = [];
    }
}
