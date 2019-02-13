export interface IWidgetEditor<T> {
    initialize?<T>(viewModel: T, callback?: () => void): void;
    model?: T;
}