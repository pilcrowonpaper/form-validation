# Adria

A super simple library for parsing form data and search params. It makes it easy to narrow the type and convert the input to something useful before doing the validation.

```bash
npm i adria-parser
yarn add adria-parser
pnpm add adria-parser
```

## Overview

```ts
import { parse } from "adria-parser";

const formData = new FormData();

// intellisense
const { username, age, profile_image, birthday interests } = parse(formData, {
  username: "string",
  age: "number",
  profile_image: "file",
  birthday: "date",
  interests: "array.string",
});

// null if empty or can't be converted to defined type

// username: string | null
// age: number | null
// profile_image: File | null
// birthday: Date | null
// interests: string[]
```

## Reference

```ts
const parse: (
  input: FormData | URLSearchParams,
  schema: Record<string, InputType>
) => Record<string, any>;
```

The result will be a `FieldName:DefinedType | null` record, where it's `null` if the field didn't exist or it couldn't coerce the input to the defined type.

### `InputType`

- `PrimitiveType`
- `${CompoundType}.${PrimitiveType}`

### `PrimitiveType`

- `string` => `string`
- `number` => `number`
- `boolean` => `boolean`
- `date` => `Date`
- `file` => `File`

### `CompoundType`

- `array` => `T[]`
