import { IHttpHeader } from '../http/IHttpHeader';

export interface IHttpRequest {
    url: string;
    method?: string;
    headers?: Array<IHttpHeader>;
    body?: any;
}