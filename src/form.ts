type MaybePromise<T> = T | Promise<T>;

type FormDataMap<T = any> = Map<T, any | null>;

type ParseFunction<T> = (
  value: any | null,
  form: FormDataMap<T>
) => MaybePromise<any>;

type Not<T, A> = T extends A ? never : T;

type FieldRecord<T> = Record<string, ParseFunction<T>>;

type ResultRecord<F extends FieldRecord<string> | FieldRecord<never>> = {
  [FieldName in keyof F]: Awaited<ReturnType<F[FieldName]>>;
};

export class Form<Fields extends FieldRecord<never> = {}> {
  private fields: Fields;
  constructor(fields?: Fields) {
    this.fields = fields || ({} as Fields);
  }
  public field = <
    FieldName extends string,
    PF extends ParseFunction<keyof Fields | FieldName>
  >(
    fieldName: Not<FieldName, keyof Fields>,
    parseFunction: PF
  ) => {
    this.fields[fieldName] = parseFunction as any;
    return this as any as Form<Fields & Record<FieldName, PF>>;
  };
  public parse = async (
    formData: FormData | Record<string, string | number>
  ): Promise<
    | {
        errors: null;
        data: ResultRecord<Fields>;
      }
    | {
        errors: {
          [k in keyof Fields]?: unknown;
        };
        data: null;
      }
  > => {
    const errors: Record<string, any> = {};
    const formDataMap =
      formData instanceof FormData
        ? (new Map(formData.entries()) as FormDataMap)
        : new Map(Object.entries(formData));
    const data: Record<string, any> = {};
    for (const [fieldName, parse] of Object.entries(this.fields)) {
      const formValue = formDataMap.get(fieldName);
      try {
        const parseResult = await parse(formValue, formDataMap as any);
        if (parseResult === undefined) continue;
        data[fieldName] = parseResult;
      } catch (e) {
        errors[fieldName] = e;
      }
    }
    if (Object.keys(errors).length > 0)
      return {
        errors: errors as any,
        data: null,
      };
    return {
      errors: null,
      data: data as any,
    };
  };
}
