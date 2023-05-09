import { defineStore } from 'pinia';

export const useCoreDataStore = defineStore('coreDataStore', {
  state: () => ({
    selectedTicker: 'BTC',
  }),
});
