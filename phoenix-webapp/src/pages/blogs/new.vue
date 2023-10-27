<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        New Blog
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 sm:rounded-lg sm:px-10 space-y-6">

        <div class="rounded-md bg-red-50 p-4 mb-3" v-if="error">
          <div class="flex">
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {{ error }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div class="mt-1">
            <input id="name" name="name" type="text" required placeholder="My Blog" :disabled="loading"
              v-model="name" @input="onNameChanged"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <SlugInput v-model="slug" @keyup="onSlugKeyup" />
        </div>

        <div class="mt-5 flex justify-between">
          <CfButton :loading="loading" @click="createBlog">
            Create Blog
          </CfButton>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import CfButton from '@/components/cf_button.vue';
import SlugInput from '@/components/slug_input.vue';
import { slugify } from '@/app/slugify';
import type { CreateBlogInput } from '@phoenix/core/api';
import * as api from '@phoenix/core/api';
import { useApiClient } from '@/app/api_client';

// props

// events

// composables
const $router = useRouter();
const $apiClient = useApiClient();

// lifecycle

// variables
let name = ref('');
let slug = ref('');
let error = ref('');
let loading = ref(false);
let slugManuallyUpdated = false;

// computed

// watch

// functions
async function createBlog() {
  loading.value = true;
  error.value = '';
  const input: CreateBlogInput = {
    name: name.value.trim(),
    slug: slug.value.trim(),
  };

  try {
    const newBlog = await api.createBlog($apiClient, input);
    $router.push(`/blogs/${newBlog.id}`);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

function onNameChanged() {
  if (!slugManuallyUpdated) {
    name.value = name.value.trim();
    slug.value = slugify(name.value);
  }
}

function onSlugKeyup() {
  slugManuallyUpdated = true;
}
</script>
