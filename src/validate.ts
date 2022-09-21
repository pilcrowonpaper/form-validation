export const validate = (
    rule: Rule,
    value: string,
    formData: FormData
): boolean => {
    if (rule.target === "value")
        return validateValue(rule.type, rule.value, value, formData);
    if (rule.target === "number")
        return validateNumber(rule.type, rule.value, value);
    if (rule.target === "length")
        return validateLength(rule.type, rule.value, value);
    if (rule.target === "type")
        return validateType(rule.type, rule.value, value);
    throw Error("Invalid rule type");
};

import "./types.js"

const isTrue = (bool: boolean, not: boolean) => {
    if (not) return !bool;
    return bool;
};

const isRuleType = (
    ruleType: RuleType,
    value: RuleType | ModRuleType<RuleType>
) => {
    return value === ruleType || value === `!${ruleType}`;
};

const validateValue = (
    ruleType: ValueRuleType | ValueFieldRuleType | ArrayRuleType,
    ruleValue: string | Readonly<string[]>,
    value: string,
    formData: FormData
): boolean => {
    const not = ruleType.startsWith("!");
    if (isRuleType("is", ruleType)) {
        return isTrue(ruleValue === value, not);
    }
    if (isRuleType("match", ruleType)) {
        return isTrue(!!value.match(new RegExp(ruleValue as string)), not);
    }
    if (isRuleType("in", ruleType)) {
        const arr = ruleValue as Readonly<string[]>;
        return isTrue(arr.includes(value), not);
    }
    if (isRuleType("isField", ruleType)) {
        const fieldValue = formData.get(ruleValue as string);
        if (fieldValue === null) return isTrue(false, not);
        return isTrue(value === fieldValue, not);
    }
    throw Error("Invalid rule type");
};

const validateNumber = (
    ruleType: NumberRuleType | ArrayRuleType,
    ruleValue: number | Readonly<number[]>,
    value: string
): boolean => {
    const not = ruleType.startsWith("!");
    const numberValue = Number(value);
    if (isNaN(numberValue)) return false;
    if (isRuleType("is", ruleType)) {
        return isTrue(numberValue === ruleValue, not);
    }
    if (isRuleType("gt", ruleType)) {
        return isTrue(numberValue > ruleValue, not);
    }
    if (isRuleType("gte", ruleType)) {
        return isTrue(numberValue >= ruleValue, not);
    }
    if (isRuleType("lte", ruleType)) {
        return isTrue(numberValue <= ruleValue, not);
    }
    if (isRuleType("lt", ruleType)) {
        return isTrue(numberValue < ruleValue, not);
    }
    if (isRuleType("in", ruleType)) {
        const arr = ruleValue as Readonly<number[]>;
        return isTrue(arr.includes(numberValue), not);
    }
    throw Error("Invalid rule type");
};

const validateLength = (
    ruleType: NumberRuleType | ArrayRuleType,
    ruleValue: number | Readonly<number[]>,
    value: string
): boolean => {
    const not = ruleType.includes("!");
    const numberValue = value.length;
    if (isRuleType("is", ruleType)) {
        return isTrue(numberValue === ruleValue, not);
    }
    if (isRuleType("gt", ruleType)) {
        return isTrue(numberValue > ruleValue, not);
    }
    if (isRuleType("gte", ruleType)) {
        return isTrue(numberValue >= ruleValue, not);
    }
    if (isRuleType("lte", ruleType)) {
        return isTrue(numberValue <= ruleValue, not);
    }
    if (isRuleType("lt", ruleType)) {
        return isTrue(numberValue < ruleValue, not);
    }
    if (isRuleType("in", ruleType)) {
        const arr = ruleValue as Readonly<number[]>;
        return isTrue(arr.includes(numberValue), not);
    }
    throw Error("Invalid rule type");
};

const validateType = (
    ruleType: TypeRuleType | ArrayRuleType,
    ruleValue: "string" | "number" | ("string" | "number")[],
    value: string
): boolean => {
    const not = ruleType.includes("!");
    const type = isNaN(Number(value)) ? "string" : "number";
    if (isRuleType("is", ruleType)) {
        return isTrue(type === ruleValue, not);
    }
    if (isRuleType("in", ruleType)) {
        const arr = ruleValue as Readonly<("string" | "number")[]>;
        return isTrue(arr.includes(ruleValue as "string" | "number"), not);
    }
    throw Error("Invalid rule type");
};
