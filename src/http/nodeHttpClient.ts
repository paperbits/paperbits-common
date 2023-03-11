import * as http from "http";
import * as https from "https";
import { HttpClient, HttpHeader, HttpRequest, HttpResponse } from "@paperbits/common/http";

export class NodeHttpClient implements HttpClient {
    constructor() { }

    public send<T>(request: HttpRequest): Promise<HttpResponse<T>> {
        const httpClient = request.url.startsWith("https://") ? https : http;

        const headers = {};
        request.headers?.forEach(header => headers[header.name] = header.value);

        const options = {
            method: request.method,
            headers: headers
        };

        return new Promise((resolve, reject) => {
            const req = httpClient.request(request.url, options, (resp) => {
                const responseData: any[] = [];

                resp.on("data", (chunk: any) => {
                    responseData.push(chunk);
                });

                resp.on("end", () => {
                    const responseHeaders = Object.keys(resp.headers).map<HttpHeader>(headerName => {
                        const value: string | string[] = <any>resp.headers[headerName];

                        return {
                            name: headerName,
                            value: Array.isArray(value)
                                ? value.join(";")
                                : value
                        };
                    });

                    const buffer = Buffer.concat(responseData);
                    const response = new HttpResponse<T>();
                    response.statusCode = <any>resp.statusCode;
                    response.statusText = <any>resp.statusMessage;
                    response.headers = responseHeaders;
                    response.body = new Uint8Array(buffer);

                    resolve(response);
                });
            });

            req.on("error", (error) => reject(error));

            if (request.body) {
                req.write(Buffer.from(request.body));
            }

            req.end();
        });
    }
}