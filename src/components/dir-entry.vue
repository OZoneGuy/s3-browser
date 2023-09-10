<template>
  <div class="dir-entry" @click="onClick">
    <div class="dir-entry__icon">
      <template v-if="entryType === 'Dir'">
        <i class="fas fa-folder"></i>
      </template>
      <template v-else>
        <i class="fas fa-file"></i>
      </template>
    </div>
    <div class="dir-entry__name">{{ name }}</div>
  </div>
</template>

<style>
.dir-entry {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.dir-entry:hover {
  background-color: #f0f0f0;
}

.dir-entry__icon {
  margin-right: 0.5rem;
}

.dir-entry__name {
  font-size: 1.2rem;
}
</style>

<script setup lang="ts">
import type { EntryType } from '../lib/s3-client'

const props = defineProps<{
  name: string
  entryType: EntryType
}>()
</script>

<script lang="ts">
import { normalizePath } from '../lib/dir-tree'

export default {
  name: 'DirEntry',
  methods: {
    onClick() {

      // navigate to the dir if it is a dir
      console.debug(this.entryType)
      if (this.entryType === 'Dir') {
        this.$router.push({ name: 'dir', params: { dir: this.name.slice(0, -1) } })
        return
      }

      // download the file if it is not a dir
      /// get the extension
      const [name, ext] = this.name.split('.')
      const filePath = `${normalizePath(this.$route.params.dir)}${name}`
      this.$router.push({ name: 'download', params: { dir: filePath }, query: { ext } })
    }
  }
}
</script>
