<template>
  <div class="h-full">
    <div v-if="$store.isAuthenticated">
      <Sidebar />
      <main>
        <div class="pl-64">
          <div class="px-4 py-6">
            <RouterView />
          </div>
        </div>
      </main>
    </div>
    <div v-else>
      <Navbar />
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './components/navbar.vue';
import Sidebar from './components/sidebar.vue';
import { useStore } from './app/store';

// props

// events

// composables
const $store = useStore();

// lifecycle

// variables

// computed

// watch

// functions
</script>
