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
import type { Page } from '@phoenix/core/entities';
import { onBeforeMount, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import * as api from '@phoenix/core/api';
import { useApiClient } from '@/app/api_client';

// props

// events

// composables
const $route = useRoute();
const $apiClient = useApiClient();

// lifecycle
onBeforeMount(() => fetchData());

// variables
const pageId = $route.params.page_id as string;

let loading = ref(false);
let error = ref('');
const page: Ref<Page | null> = ref(null);

// computed

// watch

// functions
async function fetchData() {
  loading.value = true;
  error.value = '';

  try {
    page.value = await api.getPage($apiClient, { page_id: pageId });
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
