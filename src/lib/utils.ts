export function hostname(): string {
  if (import.meta.env.MODE == 'development') {
    return 'http://localhost:8123'
  } else {
    return 'https://omaralkersh.com/api'
  }
}

export function base_url(): string {
  return '/s3-browser/'
}
