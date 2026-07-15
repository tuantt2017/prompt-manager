<template>
  <div class="toolbar">
    <n-input
      v-model:value="store.keyword"
      placeholder="Search prompt..."
      clearable
      style="width: 300px"
    />

    <n-select
      style="width: 180px"
      :options="store.models"
      v-model:value="store.model"
      clearable
      placeholder="Model"
    />

    <n-select
      style="width: 180px"
      :options="store.categories"
      v-model:value="store.category"
      clearable
      placeholder="Category"
    />

    <n-select
      v-model:value="store.sortBy"
      :options="[
        { label: 'Likes', value: 'likes' },

        { label: 'Views', value: 'views' },

        { label: 'Newest', value: 'date' },

        { label: 'Score', value: 'score' },
      ]"
      style="width: 160px"
    />
  </div>
</template>

<script setup>
import { usePromptStore } from "../store/promptStore";

const store = usePromptStore();
</script>

<style scoped>
.toolbar {
  display: flex;

  gap: 15px;

  margin-bottom: 20px;

  flex-wrap: wrap;
}
</style>
