import { Attachments, ObjectMap, Query, RequestConfig, Resource, ResponseInterface } from '../src';


export class DummyResponse extends ResponseInterface {
    public get status(): number {
        return 200;
    }

    public get statusType(): number {
        return 2;
    }

    public get text(): string {
        return '';
    }

    public get data(): any {
        return {};
    }

    public get headers(): any {
        return {};
    }

    get contentType(): string {
        return 'application/json';
    }
}


class DummyRequest {
    public readonly method: string;
    public readonly url: string;
    public readonly query: Query;
    public readonly data: any;
    public readonly attachments: Attachments;
    public readonly requestConfig: RequestConfig;

    public headers: ObjectMap;

    constructor(method: string, url: string, query: Query, data: any | null, attachments: Attachments, requestConfig: RequestConfig) {
        this.method = method;
        this.url = url;
        this.query = query;
        this.data = data;
        this.attachments = attachments;
        this.requestConfig = requestConfig;

        this.headers = {};
    }

    public set(key: string, value: string): this {
        this.headers[key] = value;
        return this;
    }

    public end(resolve: (response: any, error: any) => void) {
        resolve({
            method: this.method,
            url: this.url,
            data: this.data,
            query: this.query,
        }, null);
    }
}


export class DummyResource extends Resource {
    public wrapResponse<Req, Res, Err>(res: Res, error: Err, req: Req): ResponseInterface {
        return new DummyResponse(res, error, req);
    }

    public createRequest<
        D extends ObjectMap = any,
    >(method: string, url: string, query: Query, data: D | null, attachments: Attachments, requestConfig: RequestConfig) {
        return new DummyRequest(method, url, query, data, attachments, requestConfig);
    }

    public doRequest<Response, ErrorType>(req: any, resolve: (response: Response, error: ErrorType) => void): void {
        (req as DummyRequest).end(resolve);
    }

    public setHeader(req: any, key: string, value: string) {
        return (req as DummyRequest).set(key, value);
    }
}
