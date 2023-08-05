<template>
  <!-- show the current path at the top -->
  <div class="dir-navigator__path">
    <router-link :to="{ name: 'dir', params: { dir: '' } }">Home</router-link>
    <span v-if="path || path !== '/'">/</span>
    <span v-for="(dir, index) in path.split('/')" :key="index">
      <router-link
        v-if="dir !== ''"
        :to="{
          name: 'dir',
          params: {
            dir: path
              .split('/')
              .slice(0, index + 1)
              .join('/')
          }
        }"
        >{{ dir }}</router-link
      >
      <span v-if="dir !== '' || index !== path.split('/').length - 1">/</span>
    </span>
  </div>

  <!-- show the entries in the current path -->
  <div class="dir-navigator__entries">
    <dir-entry
      v-for="entry in entries"
      :key="entry.name"
      :name="entry.name"
      :entryType="entry.type"
    />
  </div>
</template>

<style>
.dir-navigator__path {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.dir-navigator__entries {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  grid-gap: 1rem;
}

/* @media (max-width: 768px) {
  .dir-navigator__entries {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  }
}

@media (max-width: 576px) {
  .dir-navigator__entries {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  }
}

@media (max-width: 320px) {
  .dir-navigator__entries {
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  }
} */
</style>

<script setup lang="ts">
import { S3Client, type Entry } from '../lib/s3-client'
import { normalizePath } from '../lib/dir-tree'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { computedAsync } from '@vueuse/core'

let s3: S3Client = new S3Client()
const router = useRouter()

const path = computed(() => normalizePath(router.currentRoute.value.params.dir))
const entries = computedAsync(
  async () => {
    const keys = await s3.getKeys(path.value)
    if (!keys) {
      console.error('no keys, some error happened')
      return
    }
    return keys
  },
   [] as Entry[] 
)
</script>
