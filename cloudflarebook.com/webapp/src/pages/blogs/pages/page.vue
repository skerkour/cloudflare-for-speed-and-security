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

  <PageEditor v-if="page" v-model="page" />
</template>

<script lang="ts" setup>
import PageEditor from '@/components/page_editor.vue';
import type { Page } from '@cloudflarebook.com/core/entities';
import { onBeforeMount, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import * as api from '@cloudflarebook.com/core/api';
import { useApiClient } from '@/app/api_client';
import { useStore } from '@/app/store';

// props

// events

// composables
const $route = useRoute();
const $apiClient = useApiClient();
const $store = useStore();

// lifecycle
onBeforeMount(() => fetchData());

// variables
const pageId = $route.params.page_id as string;

let error = ref('');
const page: Ref<Page | null> = ref(null);

// computed

// watch

// functions
async function fetchData() {
  $store.setLoading(true);
  error.value = '';

  try {
    page.value = await api.getPage($apiClient, { page_id: pageId });
  } catch (err: any) {
    error.value = err.message;
  } finally {
    $store.setLoading(false);
  }
}
</script>
