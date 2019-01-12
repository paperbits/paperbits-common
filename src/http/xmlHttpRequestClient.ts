import { HttpHeader } from "./httpHeader";
import { HttpClient, HttpRequest } from "../http";
import { ProgressPromise } from "../progressPromise";
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

    public send<T>(request: HttpRequest): ProgressPromise<HttpResponse<T>> {
        if (!request.method) {
            request.method = "GET";
        }

        if (!request.headers) {
            request.headers = [];
        }

        return new ProgressPromise((resolve, reject, progress) => {
            const xhr = new XMLHttpRequest();

            xhr.onprogress = (progressEvent: ProgressEvent) => {
                if (progressEvent.lengthComputable) {
                    const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
                    progress(percentComplete);
                }
            };
            xhr.responseType = "arraybuffer";
            xhr.onload = () => {
                const response = new HttpResponse<T>();
                response.statusCode = xhr.status;
                response.statusText = xhr.statusText;
                response.headers = this.parseHeaderString(xhr.getAllResponseHeaders());
                response.body = new Uint8Array(xhr.response);
                resolve(response);
            };

            xhr.open(request.method, request.url, true);

            request.headers.forEach((header) => {
                xhr.setRequestHeader(header.name, header.value);
            });

            xhr.send(request.body);
        });
    }
}