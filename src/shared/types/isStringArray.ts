export const isStringArray = (x: unknown): x is string[] =>
  Array.isArray(x) && x.length > 0 && x.every(String);