<template>
  <div class="flex flex-col w-full">
    <label for="slug" class="block text-sm font-medium leading-6 text-gray-900">Subdomain</label>
    <div class="flex mt-2 rounded-md shadow-sm">
      <input v-model="slug" type="text" name="slug" id="slug" placeholder="my-website" aria-describedby="website-subdomain"
        class="border-r-0 block w-full rounded-l-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        @keyup="onKeyup"
        />
      <span class="bg-gray-50 inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
        .{{ rootDomain }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue';
import { slugify } from '@/app/slugify';

// props
const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    required: true,
  },
});

// events
const $emit = defineEmits(['update:modelValue', 'keyup'])

// composables

// lifecycle

// variables
const rootDomain = 'cloudflarebook.com';

// computed
const slug = computed({
  get(): string {
    return props.modelValue;
  },
  set(value: string) {
    $emit('update:modelValue', value);
  }
});

// watch

// functions
function cleanSlug() {
  slug.value = slugify(slug.value);
}

function onKeyup(event: KeyboardEvent) {
  cleanSlug();
  $emit('keyup', event);
}
</script>
