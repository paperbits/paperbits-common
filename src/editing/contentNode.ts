export interface ContentConfig {
    kind: string;
    type?: string;
    nodes?: ContentConfig[];
    [key: string]: any;
}