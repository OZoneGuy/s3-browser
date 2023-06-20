import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:path*',
      name: 'dir',
      component: DirNavigator
    },
    {
      path: '/download/:path+',
      name: 'download',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Download.vue')
    }
  ]
})

export default router
