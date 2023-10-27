<template>
  <Blogs v-if="$store.isAuthenticated" />
  <Landing v-else />
</template>

<script lang="ts" setup>
import Blogs from '@/components/blogs.vue';
import Landing from '@/components/landing.vue';
import { useStore } from '@/app/store';

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
