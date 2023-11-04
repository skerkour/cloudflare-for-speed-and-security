<template>
  <div class="h-full">
    <div v-if="$store.isAuthenticated" class="h-full">
      <Sidebar />
      <main class="h-full pl-64 mx-4 my-6">
        <RouterView />
      </main>
    </div>
    <div v-else>
      <Navbar />
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Navbar from './components/navbar.vue';
import Sidebar from './components/sidebar.vue';
import { useStore } from './app/store';
import NProgress from 'nprogress';

// props

// events

// composables
const $store = useStore();

// lifecycle

// variables

// computed

// watch
watch(() => $store.loading, (newValue, oldValue) => {
  if (!oldValue && newValue) {
    NProgress.start();
  } else if (!newValue && oldValue) {
    NProgress.done();
  }
})

// functions
</script>
