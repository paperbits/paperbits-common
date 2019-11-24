export interface StyleHandler {
    key: string;
    migrate?: (style: any) => void;
    getDefaultStyle?: (key?: string) => any;
}