import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { expect } from "chai";
import { Hooks } from "./hooks";
import get from "lodash.get";

export class RequestBuilder {
  private config: AxiosRequestConfig; // Configuration for the request
  private hooks: Hooks; // Hooks for before/after request execution
  private response?: AxiosResponse; // Response stored after executing the request
  private assertionQueue: (() => void)[] = []; // Queue to hold all assertions

  constructor(
    baseUrl: string,
    context: { endpoint: string; headers: Record<string, string>; body: any },
    hooks: Hooks,
  ) {
    this.config = {
      baseURL: baseUrl,
      url: context.endpoint,
      headers: context.headers,
      data: context.body,
    };
    this.hooks = hooks;
  }

  // Method to set HTTP method (GET, POST, etc.)
  withMethod(method: Method): this {
    this.config.method = method;
    return this;
  }

  // Method to set custom headers
  withHeaders(headers: Record<string, string>): this {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  // Method to set query parameters
  withQueryParams(params: Record<string, string>): this {
    this.config.params = params;
    return this;
  }

  // Method to set request body (for POST, PUT requests)
  withBody(body: any): this {
    this.config.data = body;
    return this;
  }

  // Method to check response status after execution
  expectStatus(expectedStatus: number): this {
    this.assertionQueue.push(() => {
      expect(this.response?.status).to.equal(expectedStatus);
    });
    return this;
  }

  // Method to check specific header value
  expectHeader(header: string, value: string): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      expect(this.response.headers).to.have.property(
        header.toLowerCase(),
        value,
      );
    });
    return this;
  }

  // Method to check if a specific header exists
  expectHeaderExists(header: string): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      expect(this.response.headers).to.have.property(header.toLowerCase());
    });
    return this;
  }

  // Method to check if a specific header does not exist
  expectHeaderNotExists(header: string): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      expect(this.response.headers).to.not.have.property(header.toLowerCase());
    });
    return this;
  }

  // Method to check that the JSON response matches the expected object
  expectJson(expectedJson: Record<string, any>): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      expect(this.response.data).to.deep.equal(expectedJson);
    });
    return this;
  }

  // Method to check that a JSON path matches an expected value
  expectJsonPath(path: string, expectedValue: any): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      const value = get(this.response.data, path);
      expect(value).to.equal(expectedValue);
    });
    return this;
  }

  // Method to assert the length of an array or object at a specific JSON path
  expectJsonLength(path: string, expectedLength: number): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      const value = path
        .split(".")
        .reduce((acc, part) => acc && acc[part], this.response?.data);
      expect(value).to.have.lengthOf(expectedLength);
    });
    return this;
  }

  // Method to check if the response body contains a specific string
  expectBodyContains(text: string): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      expect(this.response.data).to.contain(text);
    });
    return this;
  }

  // Method to check if the body matches a regular expression
  expectBodyMatches(regex: RegExp): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      expect(this.response.data).to.match(regex);
    });
    return this;
  }

  // Method to check the content type of the response
  expectContentType(type: string): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      expect(this.response.headers["content-type"]).to.include(type);
    });
    return this;
  }

  // Method to check the status code is within a range
  expectStatusInRange(min: number, max: number): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      expect(this.response.status).to.be.within(min, max);
    });
    return this;
  }

  // Method to check that a redirect occurred (status 3xx)
  expectRedirect(): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      expect(this.response.status).to.be.within(300, 399);
    });
    return this;
  }

  // Method to check for cookies
  expectCookie(name: string, value: string): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      const cookies = this.response.headers["set-cookie"] || [];
      expect(cookies).to.satisfy((cookies: string[]) =>
        cookies.some((cookie) => cookie.startsWith(`${name}=${value}`)),
      );
    });
    return this;
  }

  // Method to check if a cookie contains a partial value
  expectCookieContains(name: string, partialValue: string): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      const cookies = this.response.headers["set-cookie"] || [];
      expect(cookies).to.satisfy((cookies: string[]) =>
        cookies.some((cookie) => cookie.includes(`${name}=${partialValue}`)),
      );
    });
    return this;
  }

  // Custom assertion for user-defined validations
  customAssertion(fn: (response: AxiosResponse) => void): this {
    this.assertionQueue.push(() => {
      if (!this.response)
        throw new Error("Response is not available. Run the request first.");
      fn(this.response);
    });
    return this;
  }
  
  //expect json key does expect in response
  expectJsonKeyExists(key: string): this {
    this.assertionQueue.push(() => {
      if (!this.response) throw new Error('Response is not available. Run the request first.');
  
      const value = this.response.data[key];
      expect(value).to.not.be.undefined;  // Asserts that the key exists
    });
    return this;
  }
  
  // expect json key dosnot exists in response
  expectJsonKeyNotExists(key: string): this {
    this.assertionQueue.push(() => {
      if (!this.response) throw new Error('Response is not available. Run the request first.');
  
      const value = this.response.data[key];
      expect(value).to.be.undefined;  // Asserts that the key does not exist
    });
    return this;
  }
  

  async run(): Promise<void> {
    if (this.hooks.beforeRequest) {
      await this.hooks.beforeRequest(this.config);  // Execute beforeRequest hook
    }
  
    // Set maxRedirects to 0 to handle 302 or 3xx status codes manually
    this.config.maxRedirects = 0;
  
    try {
      this.response = await axios(this.config);  // Make the HTTP request
    } catch (error) {
      if (error.response && error.response.status >= 300 && error.response.status < 400) {
        // Handle 3xx status codes without Axios throwing an error
        this.response = error.response;
      } else {
        throw error;  // Rethrow if it's not a redirect error
      }
    }
  
    if (this.hooks.afterRequest) {
      await this.hooks.afterRequest(this.response);  // Execute afterRequest hook
    }
  
    // Now, after the response is available, run all assertions in the queue
    this.assertionQueue.forEach((assert) => assert());
  }  
}
