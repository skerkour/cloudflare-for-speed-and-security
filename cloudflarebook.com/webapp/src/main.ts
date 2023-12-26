import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app.vue'
import router from '@/app/router'
import { createApiClient } from './app/api_client'
import { useStore } from './app/store'
import NProgress from 'nprogress';

async function main() {
  NProgress.configure({ easing: 'ease', speed: 500 });
  const app = createApp(App)

  app.use(createPinia())
  app.use(router);

  if (document.cookie.includes('cloudflarebook_session')) {
    const $store = useStore();
    $store.setIsAutenticated(true);
  }

  createApiClient();

  app.mount('#app')
}

main();
