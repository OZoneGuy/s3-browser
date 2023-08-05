<script lang="ts">
import { S3Client } from '../lib/s3-client'
import { normalizePath } from '../lib/dir-tree'

let s3: S3Client

interface Data {
  data: Blob | undefined
  fileType: "image" | "pdf" | "other" | undefined
  path: string
  dataURL: string | undefined
  extension: string | null
}

export default {
  name: 'Download',
  data(): Data {
    return {
      data: undefined,
      fileType: undefined,
      path: normalizePath(this.$route.params.dir),
      dataURL: undefined,
      extension: null
    }
  },
  setup() {
    s3 = new S3Client()
  },
  async created() {
    this.extension = this.$route.query.ext as string | null

    if (this.path.endsWith('/')) {
      this.path = this.path.substring(0, this.path.length - 1)
    }

    const objectPath = this.extension ? `${this.path}.${this.extension}` : this.path

    const obj = await s3.getObject(objectPath)

    if (!obj) {
      console.error('no object, some error happened. Check the console logs')
      console.debug({ objectPath })
      return
    }

    this.data = obj[0]
    const type = obj[1].split('/')
    switch (type[0]) {
      case 'image':
        this.fileType = 'image'
        break
      case 'application':
        if (type[1] === 'pdf') {
          this.fileType = 'pdf'
        } else {
          this.fileType = 'other'
        }
        break
      default:
        this.fileType = 'other'
    }
    // console.debug({data: this.data, fileType: this.fileType })
    this.dataURL = URL.createObjectURL(this.data)
  },
  mounted() {}
}
</script>

<template>
  <div>
    <h1>File Viewer</h1>
    <div v-if="data">
        <img v-if="fileType == 'image'" :src="dataURL" width="500"/>
        <iframe v-if="fileType == 'pdf'" :src="dataURL" width="500" />
    </div>
    <div v-else>
      <p>Loading file...</p>
    </div>
  </div>
</template>
