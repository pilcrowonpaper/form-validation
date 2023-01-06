type InputType =
  | `${keyof CompoundType}.${keyof PrimitiveType}`
  | keyof PrimitiveType;

type PrimitiveType = {
  string: string;
  number: number;
  date: Date;
  file: File;
  boolean: boolean;
};

type CompoundType<T extends PrimitiveType[keyof PrimitiveType] = any> = {
  array: T[];
};

type ExtractPrimitiveType<T extends InputType> =
  T extends `${keyof CompoundType}.${infer R}` ? R : never;

type ExtractCompoundType<T extends InputType> =
  T extends `${infer R}.${keyof PrimitiveType}` ? R : never;

export const parse = <
  InputValues extends Map<any, any> | FormData | URLSearchParams,
  Schema extends Record<string, InputType>
>(
  input: InputValues,
  schema: Schema
): {
  [K in keyof Schema]: Schema[K] extends keyof PrimitiveType
    ? PrimitiveType[Schema[K]] | null
    : Schema[K] extends InputType
    ? ExtractCompoundType<Schema[K]> extends keyof CompoundType
      ? ExtractPrimitiveType<Schema[K]> extends keyof PrimitiveType
        ?
            | CompoundType<
                PrimitiveType[ExtractPrimitiveType<Schema[K]>]
              >[ExtractCompoundType<Schema[K]>]
        : never
      : never
    : never;
} => {
  let result: Record<string, any> = {};
  const inputEntries = Array.from(input.entries()) as [
    string,
    FormDataEntryValue | null
  ][];
  for (const [fieldName, type] of Object.entries(schema)) {
    const types = type.split(".");
    const primitiveTypeParsers: {
      [K in keyof PrimitiveType]: (
        x: FormDataEntryValue | null
      ) => null | PrimitiveType[K];
    } = {
      string: (val) => {
        if (typeof val !== "string") return null;
        return val;
      },
      number: (val) => {
        if (typeof val !== "string") return null;
        const parsedValue = Number(val);
        if (isNaN(parsedValue)) return null;
        return parsedValue;
      },
      boolean: (val) => {
        if (typeof val !== "string") return null;
        return Boolean(val);
      },
      file: (val) => {
        if (val instanceof File) return val;
        return null;
      },
      date: (val) => {
        if (typeof val !== "string") return null;
        const date = new Date(val);
        if (isNaN(date.getTime())) return null;
        return date;
      },
    };
    if (types.length === 2) {
      const compoundType = types[0] as keyof CompoundType;
      const primitiveType = types[1] as keyof PrimitiveType;
      if (compoundType === "array") {
        const inputValues = inputEntries
          .filter(([key]) => key === fieldName)
          .map(([_, val]) => val);
        const parser = primitiveTypeParsers[primitiveType];
        const parsedValues = inputValues
          .map((val) => parser(val))
          .filter((val): val is Exclude<typeof val, null> => val !== null);
        result[fieldName] = parsedValues;
      }
      continue;
    }
    const primitiveType = types[0] as keyof PrimitiveType;
    const parser = primitiveTypeParsers[primitiveType];
    const inputValue =
      inputEntries.find(([key]) => key === fieldName)?.[1] ?? null;
    const parsedValue = parser(inputValue);
    result[fieldName] = parsedValue;
  }
  return result as any;
};
