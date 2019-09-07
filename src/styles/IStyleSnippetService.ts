export interface IStyleSnippetService {
    getThemesNames(): Promise<string[]>;
    getThemeByName?(themeName: string): Promise<any>;
    selectCurrentTheme(themeName: string): Promise<boolean>;
    getSelectedThemeName(): string;
    getStyleByKey(key: string): Promise<any>;
}