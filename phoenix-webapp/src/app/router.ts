import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/home.vue'
import Login from '@/pages/login.vue'
import Signup from '@/pages/signup.vue'
import Page404 from '@/pages/404.vue'

import NewBlog from '@/pages/blogs/new.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },

    { path: '/blogs/new', component: NewBlog },

    { path: '/:path(.*)*', component: Page404 },
  ]
})

export default router
