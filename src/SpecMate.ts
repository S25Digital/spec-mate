import { HookFunction, Hooks } from "./hooks";
import { RequestBuilder } from "./RequestBuilder";

export class SpecMate {
  private baseUrl: string;
  private hooks: Hooks = {};

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Register hooks for before/after requests or tests
  on(
    event: "beforeRequest" | "afterRequest" | "beforeTest" | "afterTest",
    hook: HookFunction,
  ): this {
    this.hooks[event] = hook;
    return this;
  }

  // Create a new RequestBuilder with context
  request(
    endpoint: string,
    headers: Record<string, string> = {},
    body: Record<string, any> | null = null,
  ): RequestBuilder {
    const context = {
      endpoint,
      headers,
      body,
    };

    // If beforeRequest hook exists, invoke it
    if (this.hooks.beforeRequest) {
      this.hooks.beforeRequest(context);
    }

    // Return a new RequestBuilder instance with the provided baseUrl, context, and hooks
    return new RequestBuilder(this.baseUrl, context, this.hooks);
  }
}
