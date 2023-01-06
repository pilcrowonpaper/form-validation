export const pattern = (regexp: RegExp, error: any) => {
  return (value: any) => {
    if (typeof value !== "string") throw error;
    if (!regexp.test(value)) throw error;
    return value;
  };
};

export const max = (maxNum: number, error: any) => {
  return (value: any) => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) throw error;
    if (parsedValue > maxNum) throw error;
    return parsedValue;
  };
};

export const min = (minNum: number, error: any) => {
  return (value: any) => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) throw error;
    if (parsedValue < minNum) throw error;
    return parsedValue;
  };
};

export const maxLength = (maxNum: number, error: any) => {
  return (value: any) => {
    if (typeof value !== "string" && typeof value !== "number") throw error;
    const parsedValue = value.toString();
    if (parsedValue.length > maxNum) throw error;
    return parsedValue;
  };
};

export const minLength = (minNum: number, error: any) => {
  return (value: any) => {
    if (typeof value !== "string" && typeof value !== "number") throw error;
    const parsedValue = value.toString();
    if (parsedValue.length < minNum) throw error;
    return parsedValue;
  };
};

export const required = (error: any) => {
  return (value: any) => {
    if (typeof value !== "string" && typeof value !== "number") throw error;
    const parsedValue = value.toString();
    if (parsedValue.length < 1) throw error;
    return parsedValue;
  };
};
