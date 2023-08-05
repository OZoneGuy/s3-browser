export function normalizePath(path: string[] | string): string {
  if (!path) {
    return ''
  }

  let normalizedPath: string
  if (typeof path === 'string') {
    normalizedPath = path
  } else {
    normalizedPath = path.join('/')
  }
  if (normalizedPath !== '') {
    // TODO: Is the end slash needed?
    normalizedPath += '/'
  }

  return normalizedPath
}
