export interface DefaultStyle {
    key: string;
    style: Object;
    migrate?: (style: any) => void;
}