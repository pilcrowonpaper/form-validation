# Adria

A super simple form validation library, with autocomplete and value/type checking using the power of TypeScript.

```bash
npm i adria-forms
```

Demo: https://adria-demo.vercel.app

## Overview

```ts
import { Form } from "adria-forms";

const form = new Form().field("username", (value) => {
    if (!value) return "Please enter your username";
    if (typeof value !== "string") return "Invalid input";
    if (value.length < 4) return "Username must be at least 4 characters long";
    return; // success
});

const formData = new FormData();

const errors = await form.validate(formData);
/*
usernameError will be typed as "Please enter..." or "Username must be..."
*/
const usernameError = errors?.username; // autocomplete
```

## Reference

### .field()

Creates a new field. `fieldName` cannot be an existing field name, and `validate` can be a synchronous or asynchronous function. A `void` return from `validate` will tell Adria the value has passed the validation.

```ts
const field: (
    fieldName: string,
    validate: (
        value: null | FormDataEntryValue,
        formData: Map<string, FormDataEntryValue | null>
    ) => MaybePromise<void | any>
) => this;
```

#### Example

```ts
new Form()
    .field("username", (value) => {
        if (!value)
            return {
                code: 0,
                message: "empty input",
            };
        return; // success
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

### .validate()

Validates the form data. Will only check fields defined with `.field()`. Will return `null` if the form data is valid or a fieldName:errorMessage record if not.

```ts
const validate: (formData: FormData) => Promise<Record<string, any> | null>;
```

#### Example

```ts
const form = new Form()
    .field("username", () => {
        return "error";
    })
    .field("password", () => {
        return {
            code: 0,
        };
    });

const errors = await form.validate(formData as FormData);

const userNameError: "fail" = errors.username; // autocomplete username, password
const randomError = errors.random; // TS will yell at you since field random does not exist
const passwordErrorCode: number = errors.password.code; // since password can return an object, code will be typed as number and not 0
```

## TypeScript tips

In the previous example (validate()), errors will only be typed with a value when the validate function returns a string/number. We can fix this by typing the return value of the validate function `as const`.

```ts
const form = new Form().field("password", () => {
    return {
        code: 0,
    } as const;
});

const errors = await form.validate(formData as FormData);

const passwordErrorCode: number = errors.password.code; // typed as 0, and not number as before
```
