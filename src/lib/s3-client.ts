import type { ListObjectsCommandInput, GetObjectCommandInput } from '@aws-sdk/client-s3'
import { S3Client as S3, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3'

interface KeysCache {
  [key: string]: string[]
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

  async getKeys(prefix: string, invalidateCache?: boolean): Promise<string[] | null> {
    if (this.keysCache[prefix] !== undefined && invalidateCache !== true) {
      return this.keysCache[prefix]
    }

    const listCommandInput: ListObjectsCommandInput = {
      Bucket: this.bucket,
      Prefix: prefix,
      Delimiter: '/'
    }

    const listCommand = new ListObjectsCommand(listCommandInput)
    let listCommandOutput
    try {
      listCommandOutput = await this.s3.send(listCommand)
    } catch (e) {
      console.log(e)
      return null
    }

    const keys = listCommandOutput.CommonPrefixes?.map((prefix) => prefix.Prefix!) || []
    this.keysCache[prefix] = keys

    return keys
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
      console.log(e)
      return null
    }

    const body = await commandOutput.Body!.transformToString()

    return [new Blob([body]), commandOutput.ContentType!]
  }
}
