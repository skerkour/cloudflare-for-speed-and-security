<template>
  <header class="bg-transparent relative z-10">
      <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <RouterLink to="/" class="-m-1.5 p-1.5">
            <span class="sr-only">Cloudflare for Speed and Security</span>
            <img class="h-8 w-auto" src="/webapp/logo.svg" alt="Logo" />
          </RouterLink>
          <!-- <span class="ml-4 text-xl font-bold text-gray-900 items-center">Cloudflare for Speed and Security</span> -->
        </div>
        <div class="flex lg:hidden">
          <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="isMobileMenuOpen = true">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <CfLink v-for="item in navigation" :key="item.name" :href="item.url" class="text-sm font-semibold leading-6 text-gray-900">
            {{ item.name }}
          </CfLink>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center">
          <RouterLink to="/login" v-if="showLoginAndSignupButtons" class="block text-sm font-semibold leading-6 text-gray-900 hover:underline">
            Log in <span aria-hidden="true">&rarr;</span>
          </RouterLink>
        </div>
      </nav>
      <Dialog as="div" class="lg:hidden" @close="isMobileMenuOpen = false" :open="isMobileMenuOpen">
        <div class="fixed inset-0 z-50" />
        <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="flex items-center justify-between">
            <a href="#" class="-m-1.5 p-1.5">
              <span class="sr-only">Cloudflare for Speed and Security</span>
              <img class="h-8 w-auto" src="/webapp/logo.svg" alt="" />
            </a>
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="isMobileMenuOpen = false">
              <span class="sr-only">Close menu</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <CfLink v-for="item in navigation" :key="item.name" :href="item.url" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  {{ item.name }}
                </CfLink>
              </div>
              <div class="py-6">
                <RouterLink to="/login" v-if="showLoginAndSignupButtons" class="block text-sm font-semibold leading-6 text-gray-900 hover:underline">
                  Log in <span aria-hidden="true">&rarr;</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  <!-- <header class="bg-transparent relative z-10">
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
  </header> -->
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import CfLink from './cf_link.vue';
import { useStore } from '@/app/store';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { Dialog, DialogPanel } from '@headlessui/vue';
import navigation from '@/app/navigation';

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


const isMobileMenuOpen = ref(false);

</script>
