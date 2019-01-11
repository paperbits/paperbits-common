import { HttpHeader } from "./httpHeader";

export interface HttpRequest {
    url: string;
    method?: string;
    headers?: HttpHeader[];
    body?: any;
}