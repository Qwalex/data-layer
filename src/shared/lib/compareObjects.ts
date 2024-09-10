import { ADDITIONAL_REMOVE_COLUMNS, DYNAMIC_PARAMETERS, INFO_COLUMNS } from '@shared/config'
import { stringifyObjectValues } from "./stringifyObjectValues"

export const compareObjects = (object1: Record<string, unknown>, object2: Record<string, unknown>) => {
  const strObject1 = stringifyObjectValues(object1)
  const strObject2 = stringifyObjectValues(object2)
  let strObject1Entries = Object.entries(strObject1)
  let diffProps: Record<string, string> = {}
  
  while(strObject1Entries.length > 0) {
    const [ key, value ] = strObject1Entries.pop() ?? []

    if (typeof key !== 'string' || key === undefined || value === undefined) {
      break
    }

    if (key in strObject2 && strObject2[key] === value) {
      continue
    }

    if ((DYNAMIC_PARAMETERS as string[]).concat(ADDITIONAL_REMOVE_COLUMNS).concat(INFO_COLUMNS).includes(key)) {
      continue
    }

    diffProps[key] = `${strObject2[key]} => ${value}`
  }

  return diffProps
}