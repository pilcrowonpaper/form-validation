type ValueRuleType = ModRuleType<"is" | "match">;
type ValueFieldRuleType = ModRuleType<"isField">;
type ArrayRuleType = ModRuleType<"in">;
type NumberRuleType = ModRuleType<"is" | "gt" | "gte" | "lte" | "lt">;
type TypeRuleType = ModRuleType<"is">;
type ModRuleType<T extends string> = T | `!${T}`;

type RuleType = "is" | "gt" | "gte" | "lte" | "lt" | "isField" | "in" | "match";

type Rule = (
    | {
          target: "value";
          type: ValueFieldRuleType;
          value: string;
      }
    | {
          target: "value";
          type: ValueRuleType;
          value: string;
      }
    | {
          target: "value";
          type: ArrayRuleType;
          value: Readonly<string[]>;
      }
    | {
          target: "number" | "length";
          type: NumberRuleType;
          value: number;
      }
    | {
          target: "number" | "length";
          type: ArrayRuleType;
          value: Readonly<number[]>;
      }
    | {
          target: "type";
          type: TypeRuleType;
          value: "string" | "number";
      }
    | {
          target: "type";
          type: ArrayRuleType;
          value: ("string" | "number")[];
      }
) & {
    error: string;
};