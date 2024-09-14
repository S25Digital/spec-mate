# **spec-mate**

**spec-mate** is a powerful API testing framework developed by **S25Digital**, designed to help developers streamline the process of testing and validating APIs. With support for advanced assertions, customizable hooks, and seamless integration with tools like **Nock**, spec-mate makes it easy to test even the most complex APIs.

---

## **Table of Contents**

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Comprehensive Assertions](#comprehensive-assertions)
- [Advanced Features](#advanced-features)
- [Test Example with Nock](#test-example-with-nock)
- [Hooks](#hooks)
- [Contribution](#contribution)
- [About S25Digital](#about-s25digital)
- [License](#license)

---

## **Features**

- **Comprehensive API Testing**: Test all aspects of an API response, from headers and status codes to cookies and JSON bodies.
- **Built-in Assertions**: Easily validate JSON paths, headers, status codes, cookies, and more.
- **Custom Assertions**: Extend functionality by adding user-defined assertions.
- **Mocking Support**: Easily integrate with **Nock** to mock HTTP requests and responses.
- **Integration with Chai**: Works seamlessly with Chai assertions, including `chai-json-schema`.
- **Hooks for Custom Logic**: Allows you to add pre- and post-request logic via hooks.

---

## **Installation**

To install **spec-mate**, use npm or yarn:

```bash
npm install spec-mate
```

Additionally, you’ll need some supporting libraries for testing:

```bash
npm install chai axios nock --save-dev
```

---

## **Usage**

### Example: Basic API Test

```typescript
import { SpecMate } from 'spec-mate';

const api = new SpecMate('https://api.example.com');

async function runTest() {
  await api.request('/users')
    .withMethod('GET')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/json')
    .expectJsonPath('results[0].name', 'John Doe')
    .run();
}

runTest();
```

This example demonstrates a simple `GET` request with validations for the response status code, content type, and a specific JSON path.

---

## **Comprehensive Assertions**

SpecMate offers a range of built-in assertions to validate various aspects of an API response. Below is a detailed list of available assertions with usage examples.

### 1. **Status Code Assertions**

Ensure that the response has the expected status code.

```typescript
.expectStatus(200)
```

### 2. **Header Assertions**

Check if a specific header exists and has the expected value.

```typescript
.expectHeader('Content-Type', 'application/json')
```

### 3. **Header Existence Assertions**

Ensure a specific header is present in the response.

```typescript
.expectHeaderExists('Content-Type')
```

Ensure a specific header is absent in the response.

```typescript
.expectHeaderNotExists('X-Powered-By')
```

### 4. **JSON Path Assertions**

Validate that a value exists at a specific path within the JSON response body. 

```typescript
.expectJsonPath('results[0].name', 'John Doe')
```

### 5. **JSON Length Assertions**

Check the length of an array or object at a specific JSON path.

```typescript
.expectJsonLength('results', 3)
```

### 6. **Body Contains Assertion**

Ensure the response body contains a specific text.

```typescript
.expectBodyContains('user')
```

### 7. **Body Regex Assertion**

Ensure that the response body matches a regular expression.

```typescript
.expectBodyMatches(/"name": "John Doe"/)
```

### 8. **Content Type Assertion**

Verify that the `Content-Type` header matches a specific type.

```typescript
.expectContentType('application/json')
```

### 9. **Status Code Range Assertion**

Ensure that the status code falls within a specific range.

```typescript
.expectStatusInRange(200, 299)
```

### 10. **Redirect Assertion**

Check if the response status is a redirection (3xx).

```typescript
.expectRedirect()
```

### 11. **Cookie Assertions**

Check for the existence and value of a cookie.

```typescript
.expectCookie('session', 'abc123')
```

Ensure that a cookie contains a specific partial value.

```typescript
.expectCookieContains('session', 'abc')
```

### 12. **Custom Assertions**

Create your own assertions with custom logic. This is helpful for more advanced testing scenarios.

```typescript
.customAssertion((response) => {
  expect(response.data.results).to.have.lengthOf.above(1);
});
```

---

## **Advanced Features**

### Custom Assertions

In addition to the built-in assertions, SpecMate allows you to define your own custom assertions to extend the testing capabilities.

```typescript
api.request('/users')
  .withMethod('GET')
  .customAssertion((response) => {
    expect(response.data).to.have.property('results').with.length.greaterThan(1);
  })
  .run();
```

### Cookie Assertions

Check for the existence or value of cookies in the response.

```typescript
.expectCookie('session', 'abc123')
.expectCookieContains('session', 'abc')
```

---

## **Test Example with Nock**

Here’s an example of using **spec-mate** with **Nock** to mock API responses for testing purposes:

```typescript
import { SpecMate } from 'spec-mate';
import nock from 'nock';

describe('API Test Example with Nock', () => {
  const api = new SpecMate('https://api.example.com');

  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  it('should mock and validate a GET request', async () => {
    // Mock GET /users API request
    nock('https://api.example.com')
      .get('/users')
      .reply(200, {
        results: [{ name: 'John Doe' }, { name: 'Jane Doe' }]
      });

    await api.request('/users')
      .withMethod('GET')
      .expectStatus(200)
      .expectJsonPath('results[0].name', 'John Doe')
      .run();
  });
});
```

---

## **Hooks**

SpecMate provides hooks that allow you to run custom logic before or after a request is made.

### Before Request Hook

Use the `beforeRequest` hook to modify request headers, such as adding authentication tokens.

```typescript
api.on('beforeRequest', (context) => {
  context.headers['Authorization'] = `Bearer some-token`;
});
```

### After Request Hook

Run logic after the request is completed, such as logging the response.

```typescript
api.on('afterRequest', (response) => {
  console.log('Response received:', response.data);
});
```


## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.


**spec-mate** is developed and maintained by [**S25Digital**](https://s25.digital)