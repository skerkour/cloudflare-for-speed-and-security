<template>
  <header class="bg-transparent relative z-10">
    <nav class="mx-auto flex max-w-7xl items-left justify-between gap-x-6 p-6 px-8 h-24" aria-label="Global">
      <div class="flex">
        <div class="flex flex-1 items-center">
          <RouterLink to="/" class="-m-1.5 p-1.5">
            <span class="sr-only">Cloudflare for Speed and Security</span>
            <img class="h-8 w-auto" src="/webapp/logo.svg" alt="Logo" />
          </RouterLink>
        </div>
        <div class="flex gap-x-6 ml-8 items-center">
          <CfLink :href="item.url" v-for="item in navigation" :key="item.name"
            class="text-sm font-semibold leading-6 text-gray-900 hover:underline">
            {{ item.name }}
          </CfLink>
        </div>
      </div>
      <div class="flex flex-1 items-center justify-end gap-x-6" >
        <RouterLink to="/login" v-if="showLoginAndSignupButtons" class="block text-sm font-semibold leading-6 text-gray-900 hover:underline">
          Log in
        </RouterLink>
        <RouterLink to="/signup" v-if="showLoginAndSignupButtons"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Signup
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CfLink from './cf_link.vue';
import { useStore } from '@/app/store';
import navigation from '@/app/navigation';

const $route = useRoute();
const $store = useStore();

const showLoginAndSignupButtons = computed(() => {
  if ($store.isAuthenticated) { // || $route.path === '/signup' || $route.path.startsWith('/login')) {
    return false;
  }
  return true;
})

const showLogoutButton = computed(() => {
  return $store.isAuthenticated;
})
</script>
