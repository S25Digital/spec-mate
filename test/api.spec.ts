import { SpecMate } from "../src/SpecMate";
import { expect } from "chai";
import nock from "nock";


// Mock the base URL
const baseUrl = "https://api.example.com";

describe("API Testing with SpecMate and Nock", () => {
  const api = new SpecMate(baseUrl);

  // Set up nock before each test to mock API responses
  beforeEach(() => {
    nock.cleanAll(); // Clean up all nock interceptors before each test
    nock.disableNetConnect(); // Disable real network requests
  });

  // Hook to add authorization headers before each request
  api.on("beforeRequest", (context) => {
    context.headers["Authorization"] = `Bearer ${generateToken()}`;
  });

  it("should validate the GET request with multiple assertions", async () => {
    // Mock the GET /users request
    nock(baseUrl)
      .get("/users")
      .reply(200, {
        results: [
          { name: "John Doe", email: "john.doe@example.com" },
          { name: "Jane Doe", email: "jane.doe@example.com" },
          { name: "John Smith", email: "john.smith@example.com" },
        ],
      });

    await api
      .request("/users")
      .withMethod("GET")
      .expectStatus(200)
      .expectHeader("Content-Type", "application/json")
      .expectJsonPath("results[0].name", "John Doe")
      .expectJsonLength("results", 3)
      .run();
  });

  it("should validate a POST request with JSON body and schema validation", async () => {
    // Mock the POST /users request
    nock(baseUrl)
      .post("/users", {
        name: "Jane Doe",
        email: "janedoe@example.com",
      })
      .reply(201, {
        name: "Jane Doe",
        email: "janedoe@example.com",
      });

    await api
      .request("/users")
      .withMethod("POST")
      .withBody({
        name: "Jane Doe",
        email: "janedoe@example.com",
      })
      .expectStatus(201)
      .expectJson({
        name: "Jane Doe",
        email: "janedoe@example.com",
      })
      .run();
  });

  it("should handle a PUT request and validate JSON response", async () => {
    // Mock the PUT /users/1 request
    nock(baseUrl)
      .put("/users/1", {
        name: "John Updated",
        email: "johnupdated@example.com",
      })
      .reply(200, {
        name: "John Updated",
        email: "johnupdated@example.com",
      });

    await api
      .request("/users/1")
      .withMethod("PUT")
      .withBody({
        name: "John Updated",
        email: "johnupdated@example.com",
      })
      .expectStatus(200)
      .expectJson({
        name: "John Updated",
        email: "johnupdated@example.com",
      })
      .run();
  });

  it("should handle DELETE requests and validate status", async () => {
    // Mock the DELETE /users/1 request
    nock(baseUrl).delete("/users/1").reply(204);

    await api.request("/users/1").withMethod("DELETE").expectStatus(204).run();
  });

  it("should validate a request with query parameters", async () => {
    // Mock the GET /users with query parameters
    nock(baseUrl)
      .get("/users")
      .query({ page: "2", limit: "10" })
      .reply(200, {
        results: new Array(10).fill({ name: "User" }),
      });

    await api
      .request("/users")
      .withMethod("GET")
      .withQueryParams({ page: "2", limit: "10" })
      .expectStatus(200)
      .expectJsonLength("results", 10)
      .run();
  });

  it("should validate redirect status and cookies", async () => {
    // Mock the POST /login request with redirection and cookies
    nock(baseUrl)
      .post("/login", { username: "testuser", password: "password" })
      .reply(302, undefined, { "set-cookie": "session=abc123" });

    await api
      .request("/login")
      .withMethod("POST")
      .withBody({ username: "testuser", password: "password" })
      .expectStatus(302)
      .expectRedirect()
      .expectCookie("session", "abc123")
      .expectCookieContains("session", "abc")
      .run();
  });

  it("should validate header existence and non-existence", async () => {
    // Mock the GET /headers request
    nock(baseUrl)
      .get("/headers")
      .reply(200, undefined, { "Content-Type": "application/json" });

    await api
      .request("/headers")
      .withMethod("GET")
      .expectHeaderExists("Content-Type")
      .expectHeaderNotExists("X-Powered-By")
      .run();
  });

  it("should handle custom assertions", async () => {
    // Mock the GET /users request
    nock(baseUrl)
      .get("/users")
      .reply(200, {
        results: [
          { name: "John Doe", email: "john.doe@example.com" },
          { name: "Jane Doe", email: "jane.doe@example.com" },
          { name: "John Smith", email: "john.smith@example.com" },
        ],
      });

    await api
      .request("/users")
      .withMethod("GET")
      .expectStatus(200)
      .customAssertion((response) => {
        expect(response.data.results).to.have.lengthOf.above(2);
      })
      .run();
  });

  // Utility function to generate a token (dummy for this example)
  function generateToken() {
    return "some-dynamic-token";
  }
});
