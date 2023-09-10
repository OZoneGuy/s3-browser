import { createRouter, createWebHistory } from 'vue-router'
import DirNavigator from '../views/DirNavigator.vue'
import Download from '../views/Download.vue'
import Login from '../views/Login.vue'
import { isAuthenticated } from '../services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:dir*',
      name: 'dir',
      component: DirNavigator
    },
    {
      path: '/download/:dir*',
      name: 'download',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Download
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

router.beforeEach(async (to) => {
  if (!(await isAuthenticated()) && to.name !== 'Login') {
    return { name: 'Login' }
  } else {
    return true
  }
})

export default router
