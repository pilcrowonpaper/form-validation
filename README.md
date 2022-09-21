# Adria

Adria allows you to write your validation code in your server, serialize it, and use it in the client. Autocomplete with the power of TypeScript!

```bash
npm i adria-forms
```

## Overview

Declare the field (input) names to validate and add rules (required, length, etc) to each of them. Rules can be chained like below.

```ts
import { createForm } from "adria-forms";

const form = createForm("username"); // declare fields to validate
form.field("username") // select the field to add the rule
    .required("Please enter your username") // message when input is invalid (in this case, no input)
    .length("gte", 4, "Username must be at least 4 characters long"); // check length of input: must be Greater Than or Equal to 4

const errors = form.validate(formData);
```

This form can be serialized into a POJO object, sent to the client, and used in the browser.

```ts
const serializedForm = form.serialize();
```

```ts
import { parseForm } from "adria-forms";

const form = parseForm(serializedForm);
const errors = form.validate(formData);
```

The error returned by `validate()` looks something like this

```ts
{
    "username": "Username must be at least 4 characters long"
}
```

All fields are optional by default, and Adria will not check against the rules if the field input is empty. Adria will check against the field's rules until it fails one or passes all of them, and continue that for each field. That means Adria can return multiple errors, just one from each field.

## Rules

### value

Checks against the string value of the field.

| ruleType | ruleValue    | description                                    |
| -------- | ------------ | ---------------------------------------------- |
| is       | string       | _value_ equals to _ruleValue_                  |
| match    | regex string | _value_ matches regular expression _ruleValue_ |
| in       | string[]     | _ruleValue_ includes _value_                   |
| isField  | field name   | _value_ equals the value of field _ruleValue_  |

### number, length

Checks against the number value of the field. Will fail if the value cannot be converted into a number.

| ruleType | ruleValue | description                   |
| -------- | --------- | ----------------------------- |
| is       | number    | _value_ equals to _ruleValue_ |
| in       | number[]  | _ruleValue_ includes _value_  |
| gt       | number    | _value_ > _ruleValue_         |
| gte      | number    | _value_ >= _ruleValue_        |
| lte      | number    | _value_ <= _ruleValue_        |
| lt       | number    | _value_ > _ruleValue_         |

### type

Checks the type ("string" or "number") of the field.

| ruleType | ruleValue              | description                   |
| -------- | ---------------------- | ----------------------------- |
| is       | "string", "number"     | _value_ equals to _ruleValue_ |
| in       | ("string", "number")[] | _ruleValue_ includes _value_  |

## Reference

### createForm

Creates a form with the provided field names.

```ts
const createForm: (...fieldNames: string[]) => Form;
```

### parseForm

Creates a form from a serialized form.

```ts
const parseForm: (serializedForm: Form) => Form;
```

### Form

#### .serialize()

Creates a serialized version of the form.

```ts
const serialize: () => SerializedForm;
```

#### .validate()

Validates the form data. The returned object is typed (`Record<fieldname, string | string>`). Returns null if it passes all rules.

```ts
const validate: () => Record<string, string> | null;
```

#### .field()

Selects a field.

```ts
const field: (
    fieldName: string // field name
) => Field;
```

##### .required()

Sets the field to be required. Will fail if the input is `""`.

```ts
const required: (errorMessage: string) => this;
```

```ts
form.field("fieldName").required("This is a required field");
```

##### .value()

Sets a rule that checks the value of the field.

```ts
const value: (
    ruleType: string,
    ruleValue: string | string[],
    errorMessage: string
) => this;
```

```ts
form.field("fieldName").value("is", "hello", "The value must be 'hello'");
```

##### .number()

Sets a rule that checks the number converted rule of the field. Will fail if the value cannot be converted to a number.

```ts
const value: (
    ruleType: string,
    ruleValue: string | string[],
    errorMessage: string
) => this;
```

```ts
form.field("fieldName").number("is", 10, "The value must be 10");
form.field("fieldName").length(
    "gte",
    8,
    "The value must be at least 8 characters long"
);
```

##### .type()

Sets a rule that checks the type (string, number) of field value.

```ts
type T = "string" | "number";

const value: (ruleType: T, ruleValue: T | T[], errorMessage: string) => this;
```

```ts
form.field("fieldName").type("is", "number", "The value must be a number");
```
