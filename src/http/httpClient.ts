import { HttpResponse } from "./httpResponse";
import { HttpRequest } from "./httpRequest";

/**
 * Basic HTTP client.
 */
export interface HttpClient {
    /**
     * Sends HTTP request.
     */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}
