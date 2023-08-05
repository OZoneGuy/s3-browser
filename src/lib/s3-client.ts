import type {
  ListObjectsCommandInput,
  GetObjectCommandInput,
  _Object,
  ListObjectsCommandOutput
} from '@aws-sdk/client-s3'
import { S3Client as S3, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3'

interface KeysCache {
  [key: string]: Entry[]
}

export type EntryType = 'dir' | 'pdf' | 'image' | 'other'

export interface Entry {
  name: string
  type: EntryType
}

export class S3Client {
  private s3: S3
  private keysCache: KeysCache = {}
  private bucket: string

  constructor() {
    // get secrets from the environment
    const AWS_SECRET_ID = import.meta.env.VITE_AWS_SECRET_ID
    const AWS_SECRET_KEY = import.meta.env.VITE_AWS_SECRET_KEY

    const AWS_BUCKET = import.meta.env.VITE_AWS_BUCKET
    if (!AWS_BUCKET) {
      throw new Error('AWS_BUCKET must be set')
    }
    this.bucket = AWS_BUCKET

    if (!AWS_SECRET_ID || !AWS_SECRET_KEY) {
      throw new Error('AWS_SECRET_ID and AWS_SECRET_KEY must be set')
    }

    this.s3 = new S3({
      region: 'us-east-2',
      credentials: {
        accessKeyId: AWS_SECRET_ID,
        secretAccessKey: AWS_SECRET_KEY
      }
    })
  }

  async getKeys(prefix: string, invalidateCache?: boolean): Promise<Entry[] | null> {
    // check if the keys are cached
    // TODO: check if the keys are cached in the local storage
    if (this.keysCache[prefix] !== undefined && invalidateCache !== true) {
      return this.keysCache[prefix]
    }

    // create the command input
    const listCommandInput: ListObjectsCommandInput = {
      Bucket: this.bucket,
      Prefix: prefix,
      Delimiter: '/'
    }

    // get the keys from the S3 bucket
    const listCommand = new ListObjectsCommand(listCommandInput)
    let listCommandOutput: ListObjectsCommandOutput
    try {
      listCommandOutput = await this.s3.send(listCommand)
    } catch (e) {
      console.error(e)
      return null
    }

    let entries: Entry[] = []

    listCommandOutput.CommonPrefixes?.forEach((prefix) => {
      entries.push({ name: prefix.Prefix!, type: 'dir' })
    })

    // get the files from `listCommandOutput.Contents` that are in the current dir
    const prefixSize = prefix.split('/').length
    listCommandOutput.Contents?.forEach((object: _Object) => {
      const key = object.Key!
      const keyParts = key.split('/')
      if (keyParts.length !== prefixSize) {
        return
      }

      let fileType: EntryType

      if (key.endsWith('.pdf')) {
        fileType = 'pdf'
      } else if (key.endsWith('.png') || key.endsWith('.jpg')) {
        fileType = 'image'
      } else {
        fileType = 'other'
      }

      entries.push({ name: keyParts[keyParts.length - 1], type: fileType })
    })

    // cache the entries
    // TODO: save to the local storage
    this.keysCache[prefix] = entries

    return entries
  }

  async getObject(key: string): Promise<[Blob, string] | null> {
    const commandInput: GetObjectCommandInput = {
      Bucket: this.bucket,
      Key: key
    }

    const command = new GetObjectCommand(commandInput)
    let commandOutput
    try {
      commandOutput = await this.s3.send(command)
    } catch (e) {
      console.error(e)
      return null
    }

    const body = await commandOutput.Body!.transformToByteArray()

    return [new Blob([body]), commandOutput.ContentType!]
  }
}
