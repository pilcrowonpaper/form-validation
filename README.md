# Adria

A super simple form validation and parsing library written in TypeScript. Works both in the client and server.

```bash
npm i adria-forms
yarn add adria-forms
pnpm add adria-forms
```

Demo: https://adria-demo.vercel.app

## Overview

```ts
import { Form } from "adria-forms";

const form = new Form().field("username", (value) => {
  if (!value) throw "Please enter your username";
  if (typeof value !== "string") throw "Invalid input";
  if (value.length < 4) throw "Username must be at least 4 characters long";
  return value;
});

const formData = new FormData(); // can be a regular object as well

const { data, errors } = await form.parse(formData);
// intellisense
const usernameError = errors?.username;
const { username } = data;
```

## Reference

## `Form`

#### `field()`

Creates a new field. `fieldName` cannot be an existing field name, and `parse` can be a synchronous or asynchronous function. The return value will be mapped to `data[fieldName]` of the return type of `parse()`.

```ts
const field: (
  fieldName: string,
  parse: (
    value: null | FormDataEntryValue,
    formData: Map<string, FormDataEntryValue | null>
  ) => MaybePromise<any>
) => Form;
```

##### Example

```ts
new Form()
  .field("username", (value) => {
    if (!value)
      throw {
        code: 0,
        message: "empty input",
      };
    return value; // success
  })
  .field("password", (_, formData) => {
    const usernameField = formData.get("username"); // autocompletes username, password
    const passwordField = formData.get("randomFieldName"); // TS will yell at you since the field doesn't exist yet
  })
  .field(
    "username" // TS will yell at you since this field already exists
    // ...
  );
```

#### `parse()`

Validates and parses the form data. Will only check fields defined with `.field()`. Either `errors` or `data` will be `null`, but not both.

```ts
const parse: (formData: FormData | Record<any, any>) => Promise<{
  errors: Record<string, any> | null; // <fieldName, error>
  data: Record<string, any> | null; // <fieldName, parseResult>
}>;
```

#### Example

```ts
const form = new Form()
  .field("username", (val) => {
    return val;
  })
  .field("password", (val) => {
    if (invalid) throw Error;
    return val;
  });

const { errors, data } = await form.parse(formData);

if (errors) {
  const usernameError: undefined | unknown = errors.username;
  const passwordError: undefined | unknown = errors.password;
} else {
  const { username, password } = data;
}
```