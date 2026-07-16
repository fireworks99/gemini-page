import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    dataLen: 0,
  }),
});