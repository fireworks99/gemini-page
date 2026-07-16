<script setup lang="ts">
import Header from './components/Header.vue';
import MainDialogue from './components/MainDialogue.vue';
import IntroSelf from './components/IntroSelf.vue';
import BottomInput from './components/BottomInput.vue';

import { useMainStore } from "@/store";
const store = useMainStore();
</script>

<template>
  <div class="wrapper">

    <Header />

    <div class="content">

      <MainDialogue />

      <div :class="['spring', { half: store.dataLen === 0 }]"></div>

      <IntroSelf v-show="store.dataLen === 0"/>

      <BottomInput />
    
    </div>

  </div>
</template>

<style scoped lang="scss">
.wrapper {
  height: 100vh;

  .content {
    height: calc(100% - 2rem - 32px);
    display: flex;
    flex-direction: column;
  }

  .spring {
    width: 100%;
    flex-grow: 1;

    &.half {
      flex-grow: 0.5;
    }
  }
}
</style>