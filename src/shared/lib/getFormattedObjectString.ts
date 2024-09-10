export const getFormattedObjectString = (obj: undefined | Record<string, unknown>) => {
  if (!obj) {
    return 'undefined'
  }

  return JSON.stringify(obj).replace(/([\[\,\{])/g, '$1\n').replace(/(\".*[^,])/g, '    $1').replace(/\}/g, '\n}').replaceAll(':', ': ')
}