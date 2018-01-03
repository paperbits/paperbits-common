export interface Contract {
    kind?: string;
    type?: string;
    nodes?: Contract[];
    [key: string]: any;
}