<template>
  <router-link v-if="isInternal" :to="href">
    <slot></slot>
  </router-link>
  <a v-else :href="href" target="_blank" rel="noopener">
    <slot></slot>
  </a>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';

// props
const props = defineProps({
  href: {
    type: String as PropType<string>,
    required: true,
  }
});

// events

// composables

// lifecycle

// variables

// computed
const isInternal = computed((): boolean => {
  if (props.href.startsWith('http')) {
    let url = null;
    try {
      url = new URL(props.href);
    } catch (err) {
      return false;
    }

    if (url.hostname != window.location.hostname) {
      return false;
    }
  }

  return true;
});

// watch

// functions
</script>
