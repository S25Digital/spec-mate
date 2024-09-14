import { HookFunction } from "./hooks";
import { RequestBuilder } from "./RequestBuilder";
export declare class SpecMate {
    private baseUrl;
    private hooks;
    constructor(baseUrl: string);
    on(event: "beforeRequest" | "afterRequest" | "beforeTest" | "afterTest", hook: HookFunction): this;
    request(endpoint: string, headers?: Record<string, string>, body?: Record<string, any> | null): RequestBuilder;
}
