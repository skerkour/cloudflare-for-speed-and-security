import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/home.vue'
import Login from '@/pages/login.vue'
import Signup from '@/pages/signup.vue'
import Page404 from '@/pages/404.vue'

import NewBlog from '@/pages/blogs/new.vue'
import BlogSettings from '@/pages/blogs/settings.vue'
import Pages from '@/pages/blogs/pages/pages.vue'
import NewPage from '@/pages/blogs/pages/new.vue'
import Page from '@/pages/blogs/pages/page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },

    { path: '/blogs/new', component: NewBlog },
    { path: '/blogs/:blog_id', redirect: (to) => `/blogs/${to.params.blog_id}/pages` },
    { path: '/blogs/:blog_id/settings', component: BlogSettings },

    { path: '/blogs/:blog_id/pages', component: Pages },
    { path: '/blogs/:blog_id/pages/new', component: NewPage },
    { path: '/blogs/:blog_id/pages/:page_id', component: Page },

    { path: '/:path(.*)*', component: Page404 },
  ]
})

export default router
