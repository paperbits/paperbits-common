import { HttpClientReponse } from "./httpClientReponse";
import { ProgressPromise } from "./../core/progressPromise";
import { IHttpRequest } from '../http/IHttpRequest';

export interface IHttpClient {
    send<T>(request: IHttpRequest): ProgressPromise<HttpClientReponse<T>>;
}
