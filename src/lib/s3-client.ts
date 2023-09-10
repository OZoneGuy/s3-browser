import { hostname } from './utils'

export type EntryType = 'Dir' | 'File'

export interface Entry {
  name: string
  kind: EntryType
}

interface S3ObjectResponse {
  blob: string
  name: string
  mime_type: string
}

export class S3Client {
  async getKeys(prefix: string, _invalidateCache?: boolean): Promise<Entry[] | null> {
    // Get the endpoint
    const URL = `${hostname()}/s3/list_objects?path=${prefix}`

    let resp = await fetch(URL, {
      credentials: 'include'
    })
    if (resp.status !== 200) {
      console.error('Error fetching keys', resp)
      return null
    }

    let entries: Entry[] = await resp.json()
    for (let i = 0; i < entries.length; i++) {
      entries[i].name = entries[i].name.substring(prefix.length)
    }

    return entries
  }

  async getObject(key: string): Promise<[Blob, string] | null> {
    const URL = `${hostname()}/s3/get_object?path=${key}`
    const resp = await fetch(URL, {
      credentials: 'include'
    })
    if (resp.status !== 200) {
      console.error('Error fetching object', resp)
      return null
    }
    const data: S3ObjectResponse = await resp.json()
    const byteCharacters = atob(data.blob)
    const byteArray = new Uint8Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i)
    }
    return [new Blob([byteArray]), data.mime_type]
  }
}
