<template>
  <div class="gallery">

    <PromptCard
      v-for="item in store.sortedPrompts"
      :key="item.id"
      :prompt="item"
      @select="selectPrompt"
    />

    <div
      v-if="store.sortedPrompts.length === 0"
      class="empty"
    >
      Không tìm thấy Prompt
    </div>

  </div>
</template>

<script setup>

import PromptCard from "./PromptCard.vue";
import { usePromptStore } from "../store/promptStore";

const store = usePromptStore();

function selectPrompt(prompt){

    store.selectedPrompt = prompt;

}

</script>

<style scoped>

.gallery{

display:grid;

grid-template-columns:repeat(auto-fill,minmax(320px,1fr));

gap:18px;

align-items:start;

}

.empty{

padding:80px;

text-align:center;

font-size:18px;

color:#999;

grid-column:1/-1;

}

@media (max-width:1200px){

.gallery{

grid-template-columns:repeat(auto-fill,minmax(280px,1fr));

}

}

@media (max-width:900px){

.gallery{

grid-template-columns:repeat(auto-fill,minmax(240px,1fr));

}

}

@media (max-width:600px){

.gallery{

grid-template-columns:1fr;

}

}

</style>