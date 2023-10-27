import { defineStore } from 'pinia'

export interface AppState {
  isAuthenticated: boolean;
}

export const useStore = defineStore('store', {
  state: () => defaultAppState(),
  actions: {
    clear() {
      this.$state = defaultAppState();
    },
    setIsAutenticated(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated;
    }
  },
})

function defaultAppState(): AppState {
  return {
    isAuthenticated: false,
  };
}
