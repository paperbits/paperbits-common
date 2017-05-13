export interface IWidgetEditor {
    setWidgetModel<T>(viewModel: T, callback?: () => void): void;
}