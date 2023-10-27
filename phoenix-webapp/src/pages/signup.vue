<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Start blogging with Phoenix today
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <p class="rounded-lg bg-blue-50 p-4 mb-3 text-blue">
        Registrations are disabled for the demo
      </p>
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
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div class="mt-1">
            <input id="email" name="email" type="email" autocomplete="email" required placeholder="my@email.com"
              v-model="email" @keyup="lowercaseEmail"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div class="mt-1">
            <input id="password" name="password" type="password" autocomplete="off" required v-model="password"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <RouterLink class="font-medium text-indigo-600 hover:text-indigo-500" to="/login">
              Already have an account? Login here!
            </RouterLink>
          </div>
        </div>

        <div>
          <CfButton @click="signup" :loading="loading" class="w-full">
            Signup
          </CfButton>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/app/store';
import CfButton from '@/components/cf_button.vue';
import * as api from '@phoenix/core/api';
import { useApiClient } from '@/app/api_client';

// props

// events

// composables
const $store = useStore();
const $router = useRouter();
const $apiClient = useApiClient();

// lifecycle
onBeforeMount(() => {
  if ($store.isAuthenticated) {
    $router.push('/');
  }
});

// variables
const error = ref('');
const loading = ref(false);

const email = ref('');
const password = ref('');

// computed

// functions
function lowercaseEmail() {
  email.value = email.value.toLowerCase();
}

async function signup() {
  loading.value = true;
  error.value = '';
  const input: api.LoginInput = {
    email: email.value,
    password: password.value,
  };

  try {
    await api.signup($apiClient, input);
    $store.setIsAutenticated(true);
    $router.push('/');
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
