import { IHttpClient } from '../http/IHttpClient';
import { IHttpRequest } from '../http/IHttpRequest';
import { ProgressPromise } from '../core/progressPromise';
import { HttpClientReponse } from '../http/httpClientReponse';


export class XmlHttpRequestClient implements IHttpClient {
    constructor() {
        this.send = this.send.bind(this);
    }

    public send<T>(request: IHttpRequest): ProgressPromise<HttpClientReponse<T>> {
        if (!request.method)
            request.method = "GET";

        if (!request.headers)
            request.headers = [];

        return new ProgressPromise((resolve, reject, progress) => {
            var xhr = new XMLHttpRequest();

            xhr.onprogress = (progressEvent: ProgressEvent) => {
                if (progressEvent.lengthComputable) {
                    let percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
                    progress(percentComplete);
                }
            };
            xhr.responseType = "arraybuffer";
            xhr.onload = function () {
                let response = new HttpClientReponse<T>(xhr.response);
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