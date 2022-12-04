export const pattern = <R extends RegExp, E extends any>(
  regexp: R,
  error: E
) => {
  return (value: any) => {
    if (typeof value !== "string") return error;
    if (!regexp.test(value)) return error;
  };
};

export const max = <Max extends number, E extends any>(
  maxNum: Max,
  error: E
) => {
  return (value: any) => {
    if (typeof value !== "string" && typeof value !== "number") return error;
    if (Number(value) > maxNum) return error;
  };
};

export const min = <Min extends number, E extends any>(
  minNum: Min,
  error: E
) => {
  return (value: any) => {
    if (typeof value !== "string" && typeof value !== "number") return error;
    if (Number(value) < minNum) return error;
  };
};

export const maxLength = <Max extends number, E extends any>(
  maxNum: Max,
  error: E
) => {
  return (value: any) => {
    if (typeof value !== "string" && typeof value !== "number") return error;
    if (value.toString().length > maxNum) return error;
  };
};

export const minLength = <Min extends number, E extends any>(
  minNum: Min,
  error: E
) => {
  return (value: any) => {
    if (typeof value !== "string" && typeof value !== "number") return error;
    if (value.toString().length < minNum) return error;
  };
};

export const required = <E extends any>(error: E) => {
  return (value: any) => {
    if (typeof value !== "string" && typeof value !== "number") return error;
    if (value.toString().length < 1) return error;
  };
};
