<template>
  <div>
    <label for="pageType" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
    <select v-model="selected" id="pageType" name="pageType"
      class="cursor-pointer mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
      <option v-for="pageType in pageTypes" :value="pageType">
        {{ pageType }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { PageType } from '@phoenix/core/entities';
import { computed, type PropType } from 'vue';

// props
const props = defineProps({
  modelValue: {
    type: String as PropType<PageType>,
    required: true,
  },
});


// events
const $emit = defineEmits(['update:modelValue']);

// composables

// lifecycle

// variables
const pageTypes = [
  PageType.Post,
  PageType.Page,
];

// computed
const selected = computed({
  get(): PageType {
    return props.modelValue;
  },
  set(value: PageType) {
    $emit('update:modelValue', value);
  }
});

// watch

// functions
</script>
