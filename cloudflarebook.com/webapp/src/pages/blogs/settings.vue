<template>
  <div class="flex-1">
    <div class="px-4 sm:px-6 md:px-0 mb-5">
      <h1 class="text-3xl font-extrabold text-gray-900">Settings</h1>
    </div>

    <div class="rounded-md bg-red-50 p-4" v-if="error">
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="blog">
      <div class="flex flex-col">

        <div class="flex mt-5 w-full">
          <div class="flex flex-col w-full">
            <label for="name" class="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div class="mt-1">
              <input id="name" name="name" type="text"
                v-model="blog.name" placeholder="Something awesome"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <div class="flex mt-5 w-full">
          <div class="flex flex-col w-full">
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div class="mt-1">
              <HtmlEditor v-model="blog.description_html" name="description" id="description"
                placeholder="My awesome blog"
              />
            </div>
          </div>
        </div>

        <div class="flex mt-5 w-full">
          <CfButton @click="onUpdateBlogClicked" :loading="loading"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Save
          </CfButton>
        </div>


        <div class="flex flex-col">
          <div class="pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
            <div class="sm:col-span-6">
              <h2 class="text-2xl font-medium text-red-500">Danger Zone</h2>
              <p class="mt-1 text-sm text-red-500">Irreversible and destructive actions.</p>
            </div>
          </div>

          <div class="mt-5 flex">
            <CfButton @click="onDeleteClicked"
              class="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                Delete Blog
            </CfButton>
          </div>
        </div>
      </div>

    </div>


  </div>
</template>

<script lang="ts" setup>
import { useApiClient } from '@/app/api_client';
import CfButton from '@/components/cf_button.vue';
import type { Blog } from '@cloudflarebook.com/core/entities';
import { onBeforeMount, ref, type Ref } from 'vue';
import { getBlog, deleteBlog } from '@cloudflarebook.com/core/api_client';
import { useRoute, useRouter } from 'vue-router';
import HtmlEditor from '@/components/html_editor.vue';
import * as api from '@cloudflarebook.com/core/api';
import { useStore } from '@/app/store';

// props

// events

// composables
const $apiClient = useApiClient();
const $route = useRoute();
const $router = useRouter();
const $store = useStore();

// lifecycle
onBeforeMount(() => fetchData());


// variables
const blogId = $route.params.blog_id as string;
let blog: Ref<Blog | null> = ref(null);
let loading = ref(false);
let error = ref('');

// computed

// watch

// functions
async function fetchData() {
  $store.setLoading(true);
  error.value = '';

  try {
    blog.value = await getBlog($apiClient, { blog_id: blogId });
  } catch (err: any) {
    error.value = err.message;
  } finally {
    $store.setLoading(false);
  }
}

async function onUpdateBlogClicked() {
  loading.value = true;
  error.value = '';
  const apiInput: api.UpdateBlogInput = {
    blog_id: blogId,
    name: blog.value!.name,
    description_html: blog.value!.description_html,
  };

  try {
    blog.value = await api.updateBlog($apiClient, apiInput);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function onDeleteClicked() {
  loading.value = true;
  error.value = '';

  if (!confirm('Do you really want to delete this blog?')) {
    return
  }

  try {
    await deleteBlog($apiClient, { blog_id: blogId });
    $router.push('/');
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
