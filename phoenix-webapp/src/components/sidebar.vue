<template>
  <div class="fixed inset-y-0 flex w-64 flex-col border-r border-gray-200 bg-gray-50 pb-4 pt-5">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex h-0 flex-1 flex-col overflow-y-auto pt-1">
        <!-- User account dropdown -->
        <Menu as="div" class="relative inline-block px-3 text-left">
          <div>
            <MenuButton class="group w-full rounded-md bg-gray-50 px-3.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100">
              <span class="flex w-full items-center justify-between">
                <span class="flex min-w-0 items-center justify-between space-x-3">
                  <span class="flex min-w-0 flex-1 flex-col">
                    <span class="truncate text-sm font-medium text-gray-900">H4ck3r</span>
                    <span class="truncate text-sm text-gray-500">@h4ck3r</span>
                  </span>
                </span>
                <ChevronUpDownIcon class="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              </span>
            </MenuButton>
          </div>
          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="absolute left-0 right-0 z-10 mx-3 mt-1 origin-top divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div class="py-1">
                <MenuItem v-slot="{ active }" v-for="item in secondaryNavigation">
                  <CfLink :href="item.url"
                    :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                    {{ item.name }}
                  </CfLink>
                </MenuItem>
              </div>
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <span @click="logout" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                    Logout
                  </span>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        <!-- Navigation -->
        <nav class="mt-6 px-3">
          <div class="space-y-1">
            <RouterLink v-for="item in navigation" :key="item.name" :to="item.to" :class="[item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900', 'group flex items-center rounded-md px-2 py-2 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">
              <component :is="item.icon" :class="[item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-3 h-6 w-6 flex-shrink-0']" aria-hidden="true" />
              {{ item.name }}
            </RouterLink>
          </div>
        </nav>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch, type Ref, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import {
  Cog6ToothIcon,
  HomeIcon,
  DocumentIcon,
  PhotoIcon,
} from '@heroicons/vue/24/outline';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import secondaryNavigation from '@/app/navigation';
import CfLink from '@/components/cf_link.vue'

type NavigationItem = {
  name: string;
  to: string;
  current: boolean;
  icon: any;
};

// props

// events

// composables
const $route = useRoute();

// lifecycle
onBeforeMount(() => setNav());

// variables
let navigation: Ref<NavigationItem[]> = ref([]);

// computed

// watch
watch($route, () => setNav(), { deep: true });

// functions
function setNav() {
  const blogId = $route.params.blog_id;
  if ($route.path.startsWith('/blogs/') && $route.path !== '/blogs/new') {
    navigation.value = [
      { name: 'Home', to: `/`, icon: HomeIcon, current: false },
      { name: 'Pages', to: `/blogs/${blogId}/pages`, icon: DocumentIcon, current: false },
      { name: 'Assets', to: `/blogs/${blogId}/assets`, icon: PhotoIcon, current: false },
      { name: 'Settings', to: `/blogs/${blogId}/settings`, icon: Cog6ToothIcon, current: false },
    ];
  } else {
    navigation.value = [
      { name: 'Home', to: `/`, icon: HomeIcon, current: false },
    ];
  }
}

function logout() {
  document.cookie = "phoenix_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = '/';
}
</script>
