import * as XMLHttpRequest from "xhr2";
import { HttpHeader } from "./httpHeader";
import { HttpClient, HttpRequest } from "../http";
import { HttpResponse } from "./httpResponse";


export class XmlHttpRequestClient implements HttpClient {
    constructor() {
        this.send = this.send.bind(this);
    }

    private parseHeaderString(headerString: string): HttpHeader[] {
        if (!headerString) {
            return [];
        }

        const headers = [];
        const headerPairs = headerString.split("\u000d\u000a");

        for (const headerPair of headerPairs) {
            const index = headerPair.indexOf("\u003a\u0020");

            if (index > 0) {
                const name = headerPair.substring(0, index);
                const value = headerPair.substring(index + 2);

                const header: HttpHeader = {
                    name: name,
                    value: value
                };

                headers.push(header);
            }
        }
        return headers;
    }

    public send<T>(request: HttpRequest): Promise<HttpResponse<T>> {
        if (!request.method) {
            request.method = "GET";
        }

        if (!request.headers) {
            request.headers = [];
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            const onRequestTimeout = () => {
                reject({
                    message: `Request timed out. Please try again later.`,
                    code: "RequestError",
                    details: []
                });
            };

            const onStateChange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }

                if (xhr.status === 0) {
                    reject({
                        message: `Could not complete the request. Please try again later.`,
                        code: "RequestError",
                        requestedUrl: request.url,
                        details: []
                    });
                    return;
                }

                const response = new HttpResponse<T>();
                response.statusCode = xhr.status;
                response.statusText = xhr.statusText;
                response.headers = this.parseHeaderString(xhr.getAllResponseHeaders());
                response.body = new Uint8Array(xhr.response);

                resolve(response);
            };

            xhr.responseType = "arraybuffer";
            xhr.onreadystatechange = onStateChange.bind(this);
            xhr.ontimeout = onRequestTimeout.bind(this);

            xhr.open(request.method, request.url, true);

            request.headers.forEach((header) => {
                xhr.setRequestHeader(header.name, header.value);
            });

            xhr.send(request.body);
        });
    }
}