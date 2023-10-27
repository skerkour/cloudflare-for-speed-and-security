<template>
  <div class="flex flex-col justify-center max-w-2xl mx-auto">
    <div class="flex">
      <RouterLink  :to="newBlogUrl">
        <CfButton>
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Blog
        </CfButton>
      </RouterLink>
    </div>
    <div class="flex mt-4">
      <ul role="list" class="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm border rounded-xl w-full">
        <li v-for="blog in blogs" :key="blog.id"
          class="relative flex gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 cursor-pointer">
          <RouterLink :to="`/blogs/${blog.id}`" class="flex w-full justify-between">
            <div class="flex gap-x-4">
              <!-- <img class="h-12 w-12 flex-none rounded-full bg-gray-50" :src="person.imageUrl" alt="" /> -->
              <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-gray-900">
                  <span class="absolute inset-x-0 -top-px bottom-0" />
                  {{ blog.name }}
                </p>
                <p class="mt-1 flex text-xs leading-5 text-gray-500">
                  <span class="relative truncate">{{ blog.slug }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-x-4">
              <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useApiClient } from '@/app/api_client';
import type { Blog } from '@phoenix/core/entities';
import { onBeforeMount, ref, type Ref } from 'vue';
import * as api from '@phoenix/core/api';
import { PlusIcon } from '@heroicons/vue/24/outline';
import CfButton from '@/components/cf_button.vue';

// props

// events

// composables
const $apiClient = useApiClient();

// lifecycle
onBeforeMount(() => fetchData());

// variables
let loading = ref(false);
let error = ref('');
const newBlogUrl = '/blogs/new'

const blogs: Ref<Blog[]> = ref([]);

// computed

// watch

// functions
async function fetchData() {
  loading.value = true;
  error.value = '';

  try {
    blogs.value = await api.getBlogs($apiClient);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
