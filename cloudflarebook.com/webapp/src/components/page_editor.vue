<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-row justify-between items-center">
      <div class="flex items-center">
        <div class="flex">
          <RouterLink :to="backRoute">
            <button
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                Back
            </button>
          </RouterLink>
        </div>
        <div class="flex ml-5">
          <CfButton @click="updatePage" :loading="loading" v-if="modelValue"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Save
          </CfButton>
          <CfButton @click="createPage" :loading="loading" v-else
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Create
          </CfButton>
        </div>
      </div>

      <div v-if="modelValue" class="flex items-center">
        <div class="flex ml-5">
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <!-- Options -->
                <EllipsisVerticalIcon class="h-5 w-5 text-gray-700" aria-hidden="true" />
              </MenuButton>
            </div>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem @click="deletePage" v-slot="{ active }">
                    <span
                      :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'cursor-pointer block px-4 py-2 text-sm']">
                      Delete Page
                    </span>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>

      </div>
    </div>

    <div class="rounded-md bg-red-50 p-4 my-5" v-if="error">
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex mt-5 w-full">
      <div class="flex flex-col w-full">
        <label for="title" class="block text-sm font-medium text-gray-700">
          Title
        </label>
        <div class="mt-1">
          <input id="title" name="title" type="text"
            v-model="title" placeholder="Something awesome"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
    </div>

    <div class="flex mt-5 w-full" v-if="!modelValue">
      <SelectPageType v-model="pageType" />
    </div>

    <div class="flex mt-5 w-full">
      <div class="flex flex-col w-full">
        <label for="slug" class="block text-sm font-medium text-gray-700">
          Url
        </label>
        <div class="mt-1">
          <input id="slug" name="slug" type="text"
            v-model="slug"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
    </div>

      <div class="flex flex-col mt-5 w-full">
        <div class="flex">
          <CfButton>
            Upload image
          </CfButton>
        </div>
        <div class="flex mt-4">
          <HtmlEditor v-model="contentHtml" name="contentHtml" id="contentHtml"
            placeholder="What are you thinking about today?"
          />
        </div>
      </div>


  </div>

</template>

<script lang="ts" setup>
import { ref, type PropType, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import CfButton from '@/components/cf_button.vue';
import { PageType, type Page } from '@cloudflarebook.com/core/entities';
import { useApiClient } from '@/app/api_client';
import * as api from '@cloudflarebook.com/core/api';
import SelectPageType from '@/components/select_page_type.vue';
import HtmlEditor from '@/components/html_editor.vue';

// props
const props = defineProps({
  modelValue: {
    type: Object as PropType<Page | null>,
    required: false,
    default: null,
  },
});

// events
const $emit = defineEmits(['update:modelValue']);

// composables
const $route = useRoute();
const $router = useRouter();
const $apiClient = useApiClient();

// lifecycle
onMounted(() => {
  if (props.modelValue) {
    title.value = props.modelValue.title;
    slug.value = props.modelValue.slug;
    contentHtml.value = props.modelValue.content_html;
  }
});

// variables
const blogId = $route.params.blog_id as string;
const backRoute = `/blogs/${blogId}/pages`;

let loading = ref(false);
let error = ref('');
let title = ref('');
let slug = ref('/');
let contentHtml = ref('');
let pageType = ref(PageType.Post);

// computed

// watch

// functions
async function createPage() {
  loading.value = true;
  error.value = '';
  const input: api.CreatePageInput = {
    blog_id: blogId,
    title: title.value,
    slug: slug.value,
    type: pageType.value,
    content_html: contentHtml.value,
  };

  try {
    const page = await api.createPage($apiClient, input);
    $router.push(`/blogs/${blogId}/pages/${page.id}`);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function updatePage() {
  loading.value = true;
  error.value = '';
  const input: api.UpdatePageInput = {
    page_id: props.modelValue!.id,
    slug: slug.value,
    title: title.value,
    content_html: contentHtml.value,
  };

  try {
    const page = await api.updatePage($apiClient, input);
    $emit('update:modelValue', page);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}


async function deletePage() {
  if(!confirm('Do you really want to delete this page?')) {
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await api.deletePage($apiClient, { page_id: props.modelValue!.id });
    $router.push(backRoute);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
