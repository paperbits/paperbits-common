import { HttpHeader } from "./httpHeader";

/**
 * HTTP request.
 */
export interface HttpRequest {
    /**
     * Request URL, e.g. `https://httpbin.org/get`;
     */
    url: string;

    /**
     * HTTP method, e.g. `GET`.
     */
    method?: string;

    /**
     * HTTP headers, e.g. `application/json`.
     */
    headers?: HttpHeader[];

    /**
     * HTTP request body (optional).
     */
    body?: any;
}