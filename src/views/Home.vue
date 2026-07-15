<template>
  <n-layout has-sider style="height:100vh">

    <!-- LEFT -->

    <n-layout-sider
      bordered
      :width="420"
      collapse-mode="width"
    >

      <div class="left-panel">

        <div v-if="store.loading" class="status-box">
          Loading prompts...
        </div>

        <div v-else-if="store.loadError" class="status-box error">
          {{ store.loadError }}
        </div>

        <SearchBar/>

        <Gallery/>

      </div>

    </n-layout-sider>

    <!-- RIGHT -->

    <n-layout>

      <n-layout-content>

        <div class="right-panel">

          <PromptDetail/>

        </div>

      </n-layout-content>

    </n-layout>

  </n-layout>

</template>

<script setup>
import { onMounted } from "vue";

import Gallery from "../components/Gallery.vue"
import PromptDetail from "../components/PromptDetail.vue"
import SearchBar from "../components/SearchBar.vue"
import { usePromptStore } from "../store/promptStore";

const store = usePromptStore();

onMounted(() => {
  if (!store.prompts.length && !store.loading) {
    store.loadPrompts();
  }
});

</script>

<style scoped>

.left-panel{

height:100%;

padding:15px;

overflow:auto;

}

.right-panel{

padding:20px;

height:100%;

overflow:auto;

background:#fafafa;

}

.status-box {
  margin-bottom: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
  font-size: 13px;
}

.status-box.error {
  background: #fef2f2;
  color: #b91c1c;
}

</style>
