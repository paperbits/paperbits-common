import { HttpResponse } from "./httpResponse";
import { ProgressPromise } from "../progressPromise";
import { HttpRequest } from "./httpRequest";

export interface HttpClient {
    send<T>(request: HttpRequest): ProgressPromise<HttpResponse<T>>;
}
