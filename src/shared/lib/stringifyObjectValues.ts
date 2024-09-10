export const stringifyObjectValues = (
  obj: Record<string, unknown>
): Record<string, string> => Object.entries(obj).reduce<Record<string, string>>((acc, [key, value]) => {
  acc[key] = String(value).trim()

  return acc
}, {})
