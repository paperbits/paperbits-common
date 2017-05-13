export interface IComponent {
    name: string;
    params: any;
    oncreate?: (viewModel) => void;
}