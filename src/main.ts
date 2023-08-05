import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue from 'vue'

import DirEntry from './components/dir-entry.vue'

const app = createApp(App)

app.use(router)
app.component('dir-entry', DirEntry)

app.mount('#app')
