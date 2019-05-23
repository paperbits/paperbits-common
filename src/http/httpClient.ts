import { HttpResponse } from "./httpResponse";
import { HttpRequest } from "./httpRequest";

export interface HttpClient {
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}
