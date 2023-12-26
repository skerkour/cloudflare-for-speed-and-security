<template>
  <div class="rounded-md bg-red-50 p-4 mb-3" v-if="error">
    <div class="flex">
      <div class="ml-3">
        <p class="text-sm text-red-700">
          {{ error }}
        </p>
      </div>
    </div>
  </div>

  <div  class="flex flex-col">
    <div class="flex">
      <RouterLink  :to="newPageUrl">
        <CfButton>
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Page
        </CfButton>
      </RouterLink>
    </div>
    <div class="flex mt-4">
      <div class="-my-2 overflow-x-auto min-w-full">
        <div class="py-2 align-middle inline-block min-w-full">
          <div class="overflow-hidden border border-gray-300 sm:rounded-lg">
            <div class="table min-w-full divide-y divide-gray-200">
              <thead class="table-header-group bg-gray-50">
                <tr class="max-w-0">
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                </tr>
              </thead>
              <tbody class="min-w-full bg-white divide-y divide-gray-200">
                <RouterLink :to="pageUrl(page.id)" v-for="page in pages" :key="page.id"
                  class="table-row cursor-pointer min-w-full">
                  <div class="table-cell px-6 py-4 whitespace-nowrap max-w-0 w-full">
                    <div class="text-md font-medium text-gray-900 truncate">
                      {{ page.title }}
                    </div>
                  </div>
                  <div class="table-cell mx-3 px-8 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ page.slug }}</div>
                  </div>
                </RouterLink>
              </tbody>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useApiClient } from '@/app/api_client';
import type { Page } from '@cloudflarebook.com/core/entities';
import { onBeforeMount, ref, type Ref } from 'vue';
import * as api from '@cloudflarebook.com/core/api';
import { useRoute } from 'vue-router';
import CfButton from '@/components/cf_button.vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useStore } from '@/app/store';

// props

// events

// composables
const $apiClient = useApiClient();
const $route = useRoute();
const $store = useStore();

// lifecycle

// variables
const blogId = $route.params.blog_id as string;
const newPageUrl = `/blogs/${blogId}/pages/new`;

let error = ref('');

const pages: Ref<Page[]> = ref([]);

// computed
onBeforeMount(() => fetchData());

// watch

// functions
function pageUrl(pageId: string) {
  return `/blogs/${blogId}/pages/${pageId}`;
}

async function fetchData() {
  $store.setLoading(true);
  error.value = '';

  try {
    pages.value = await api.getPages($apiClient, { blog_id: blogId });
  } catch (err: any) {
    error.value = err.message;
  } finally {
    $store.setLoading(false);
  }
}
</script>
