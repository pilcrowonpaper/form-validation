import { validate } from "./validate.js";

import "./types.js";

class Field<
    Attributes extends {
        name: string;
        rules: Rule[];
        isRequired:
            | {
                  error: string;
              }
            | false;
    },
    FieldNames extends Readonly<string[]>
> {
    public name: Attributes["name"];
    public fieldNames: FieldNames;
    public rules: Attributes["rules"];
    public isRequired: Attributes["isRequired"];
    constructor(attributes: Attributes, fieldNames: FieldNames) {
        this.name = attributes.name;
        this.rules = attributes.rules;
        this.isRequired = attributes.isRequired;
        this.fieldNames = fieldNames;
    }
    public value = <
        Rule extends ValueRuleType | ValueFieldRuleType | ArrayRuleType,
        Value extends Rule extends ValueRuleType
            ? string
            : Rule extends ValueFieldRuleType
            ? FieldNames[number]
            : Readonly<string[]>,
        ErrorMessage extends string
    >(
        rule: Rule,
        value: Value,
        errorMessage: ErrorMessage
    ): this => {
        if (rule === "isField" || rule === "!isField") {
            this.rules.push({
                target: "value",
                type: rule,
                value: value as string,
                error: errorMessage,
            });
            return this;
        }
        if (typeof value === "string") {
            this.rules.push({
                target: "value",
                type: rule as ValueRuleType,
                value,
                error: errorMessage,
            });
            return this;
        } else {
            this.rules.push({
                target: "value",
                type: rule as ArrayRuleType,
                value: value as string[],
                error: errorMessage,
            });
            return this;
        }
    };
    public number = <
        Rule extends NumberRuleType | ArrayRuleType,
        Value extends Rule extends NumberRuleType ? number : Readonly<number[]>,
        ErrorMessage extends string
    >(
        rule: Rule,
        value: Value,
        errorMessage: ErrorMessage
    ): this => {
        if (typeof value === "number") {
            this.rules.push({
                target: "number",
                type: rule as NumberRuleType,
                value,
                error: errorMessage,
            });
            return this as any;
        } else {
            this.rules.push({
                target: "number",
                type: rule as ArrayRuleType,
                value: value as number[],
                error: errorMessage,
            });
            return this as any;
        }
    };
    public length = <
        Rule extends NumberRuleType,
        Value extends number,
        ErrorMessage extends string
    >(
        rule: Rule,
        value: Value,
        errorMessage: ErrorMessage
    ): this => {
        this.rules.push({
            target: "length",
            type: rule,
            value,
            error: errorMessage,
        });
        return this as any;
    };
    public type = <
        Rule extends TypeRuleType | ArrayRuleType,
        Value extends Rule extends TypeRuleType
            ? "string" | "number"
            : ("string" | "number")[],
        ErrorMessage extends string
    >(
        rule: Rule,
        value: Value,
        errorMessage: ErrorMessage
    ): this => {
        if (value === "string" || value === "number") {
            this.rules.push({
                target: "type",
                type: rule as TypeRuleType,
                value,
                error: errorMessage,
            });
            return this as any;
        } else {
            this.rules.push({
                target: "type",
                type: rule as ArrayRuleType,
                value,
                error: errorMessage,
            });
            return this as any;
        }
    };
    public required = (errorMessage: string): this => {
        this.isRequired = {
            error: errorMessage,
        };
        return this;
    };
}

type SerializedForm<
    F extends Field<
        {
            name: string;
            rules: any;
            isRequired: any;
        },
        any
    >
> = Partial<Record<F["name"], F["rules"]>>;

class Form<
    Fields extends Readonly<
        Field<
            {
                name: string;
                rules: Rule[];
                isRequired:
                    | {
                          error: string;
                      }
                    | false;
            },
            Readonly<string[]>
        >[]
    >
> {
    public fields: Map<Fields[number]["name"], Fields[number]>;
    constructor(...fields: Fields) {
        this.fields = new Map(fields.map((val) => [val.name, val]));
    }
    public field = <Field extends Fields[number]>(fieldName: Field["name"]) => {
        return this.fields.get(fieldName) as Field;
    };
    public serialize = (): SerializedForm<Fields[number]> => {
        const entries = Array.from(this.fields.entries());
        return Object.fromEntries(
            entries.map(([key, value]) => {
                return [key, value.rules];
            })
        ) as any;
    };
    public validate = (formData: FormData) => {
        const errors: {
            [name: string]: string;
        } = {};
        this.fields.forEach((field, fieldName) => {
            const formValue = formData.get(fieldName)?.toString();
            if (formValue === undefined || formValue === "") {
                if (field.isRequired !== false) {
                    errors[fieldName] = field.isRequired.error;
                }
                return;
            }
            let errorMessage: string | null = null;
            field.rules.every((rule) => {
                const valid = validate(rule, formValue, formData);
                if (!valid) {
                    errorMessage = rule.error;
                }
                return valid;
            });
            if (!errorMessage) return;
            errors[fieldName] = errorMessage;
        });
        return Object.keys(errors).length > 0
            ? (errors as Partial<Record<Fields[number]["name"], string>>)
            : null;
    };
}

export const createForm = <FieldNames extends Readonly<string[]>>(
    ...fieldNames: FieldNames
) => {
    return new Form(
        ...fieldNames.map(
            (val) =>
                new Field(
                    {
                        name: val,
                        rules: [],
                        isRequired: false,
                    },
                    fieldNames
                ) as Field<
                    {
                        name: FieldNames[number];
                        rules: [];
                        isRequired: false;
                    },
                    FieldNames
                >
        )
    );
};

export const parseForm = <S extends SerializedForm<Field<any, any>>>(
    serializedForm: S
) => {
    return new Form(
        ...Object.entries(serializedForm).map(
            ([key, value]) =>
                new Field(
                    {
                        name: key,
                        rules: value as Rule[],
                        isRequired: false,
                    },
                    []
                )
        )
    ) as Form<
        Field<
            {
                name: Extract<keyof S, string>;
                rules: [];
                isRequired: any;
            },
            any
        >[]
    >;
};
