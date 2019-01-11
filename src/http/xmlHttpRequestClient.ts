import { HttpClient, HttpRequest } from "../http";
import { ProgressPromise } from "../progressPromise";
import { HttpResponse } from "./httpResponse";


export class XmlHttpRequestClient implements HttpClient {
    constructor() {
        this.send = this.send.bind(this);
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
            xhr.onload = function () {
                const response = new HttpResponse<T>(xhr.response);
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