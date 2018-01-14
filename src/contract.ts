export interface Contract {
    object?: string;
    type?: string;
    nodes?: Contract[];
    [key: string]: any;
}