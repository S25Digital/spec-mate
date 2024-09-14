export type HookFunction = (context: any) => void | Promise<void>;

export interface Hooks {
  beforeRequest?: HookFunction;
  afterRequest?: HookFunction;
  beforeTest?: HookFunction;
  afterTest?: HookFunction;
}
