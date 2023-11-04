import { defineStore } from 'pinia'

export interface AppState {
  isAuthenticated: boolean;
  loading: boolean,
}

export const useStore = defineStore('store', {
  state: () => defaultAppState(),
  actions: {
    clear() {
      this.$state = defaultAppState();
    },
    setIsAutenticated(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    }
  },
})

function defaultAppState(): AppState {
  return {
    isAuthenticated: false,
    loading: false,
  };
}
