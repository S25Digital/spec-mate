import { AxiosResponse, Method } from "axios";
import { Hooks } from "./hooks";
export declare class RequestBuilder {
    private config;
    private hooks;
    private response?;
    private assertionQueue;
    constructor(baseUrl: string, context: {
        endpoint: string;
        headers: Record<string, string>;
        body: any;
    }, hooks: Hooks);
    withMethod(method: Method): this;
    withHeaders(headers: Record<string, string>): this;
    withQueryParams(params: Record<string, string>): this;
    withBody(body: any): this;
    expectStatus(expectedStatus: number): this;
    expectHeader(header: string, value: string): this;
    expectHeaderExists(header: string): this;
    expectHeaderNotExists(header: string): this;
    expectJson(expectedJson: Record<string, any>): this;
    expectJsonPath(path: string, expectedValue: any): this;
    expectJsonLength(path: string, expectedLength: number): this;
    expectBodyContains(text: string): this;
    expectBodyMatches(regex: RegExp): this;
    expectContentType(type: string): this;
    expectStatusInRange(min: number, max: number): this;
    expectRedirect(): this;
    expectCookie(name: string, value: string): this;
    expectCookieContains(name: string, partialValue: string): this;
    customAssertion(fn: (response: AxiosResponse) => void): this;
    expectJsonKeyExists(key: string): this;
    expectJsonKeyNotExists(key: string): this;
    run(): Promise<void>;
}
