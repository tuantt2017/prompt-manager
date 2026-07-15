<template>
  <n-card
    hoverable
    embedded
    class="prompt-card"
    @click="handleSelect"
  >
    <!-- IMAGE -->

    <div class="image-wrapper">

      <n-image
        :src="coverImage"
        :fallback-src="noImage"
        object-fit="cover"
        width="100%"
        height="220"
        lazy
        preview-disabled
      />

      <div class="rating-badge">

        ⭐ {{ prompt.rating ?? 0 }}

      </div>

      <div class="score-badge">

        {{ prompt.score ?? 0 }}

      </div>

    </div>

    <!-- CONTENT -->

    <div class="content">

      <div class="title">

        {{ shortPrompt }}

      </div>

      <div class="author-row">

        <span class="author">

          {{ prompt.author || "Unknown" }}

        </span>

        <n-tag
          size="small"
          type="success"
          round
        >

          {{ prompt.model }}

        </n-tag>

      </div>

      <div
        class="categories"
        v-if="prompt.categories?.length"
      >

        <n-tag
          v-for="item in prompt.categories"
          :key="item"
          size="small"
          round
          type="info"
        >

          {{ item }}

        </n-tag>

      </div>

      <div class="stats">

        <div>

          ❤️ {{ format(prompt.likes) }}

        </div>

        <div>

          👁 {{ format(prompt.views) }}

        </div>

      </div>

      <div class="date">

        {{ prompt.date }}

      </div>

    </div>

  </n-card>
</template>

<script setup>

import { computed } from "vue";

const emit = defineEmits([
    "select"
]);

const props = defineProps({

    prompt:{

        type:Object,

        required:true

    }

});

const noImage =
"https://via.placeholder.com/600x400?text=No+Image";

const coverImage = computed(()=>{

    if(props.prompt.image){

        return props.prompt.image;

    }

    if(

        props.prompt.images &&

        props.prompt.images.length

    ){

        return props.prompt.images[0];

    }

    return noImage;

});

const shortPrompt = computed(()=>{

    const text = props.prompt.prompt || "";

    if(text.length <= 120){

        return text;

    }

    return text.substring(0,120)+"...";

});

function handleSelect(){

    emit(

        "select",

        props.prompt

    );

}

function format(value){

    if(!value){

        return 0;

    }

    if(value>=1000000){

        return (

            value/1000000

        ).toFixed(1)+"M";

    }

    if(value>=1000){

        return (

            value/1000

        ).toFixed(1)+"K";

    }

    return value;

}

</script>

<style scoped>

.prompt-card{

cursor:pointer;

transition:.25s;

border-radius:14px;

overflow:hidden;

}

.prompt-card:hover{

transform:translateY(-6px);

box-shadow:0 10px 30px rgba(0,0,0,.15);

}

.image-wrapper{

position:relative;

overflow:hidden;

}

.rating-badge{

position:absolute;

left:10px;

top:10px;

background:#ffb300;

color:white;

padding:4px 10px;

border-radius:20px;

font-size:12px;

font-weight:bold;

}

.score-badge{

position:absolute;

right:10px;

top:10px;

background:#18a058;

color:white;

padding:4px 10px;

border-radius:20px;

font-size:12px;

font-weight:bold;

}

.content{

padding-top:10px;

}

.title{

font-size:14px;

font-weight:600;

line-height:1.5;

height:64px;

overflow:hidden;

display:-webkit-box;

-webkit-line-clamp:3;

-webkit-box-orient:vertical;

}

.author-row{

display:flex;

justify-content:space-between;

align-items:center;

margin-top:12px;

gap:10px;

}

.author{

font-size:13px;

font-weight:600;

color:#666;

overflow:hidden;

white-space:nowrap;

text-overflow:ellipsis;

}

.categories{

display:flex;

flex-wrap:wrap;

gap:6px;

margin-top:12px;

}

.stats{

display:flex;

justify-content:space-between;

margin-top:16px;

font-size:13px;

font-weight:600;

color:#555;

}

.date{

margin-top:10px;

font-size:12px;

color:#999;

}

@media (max-width:768px){

.title{

height:auto;

}

}

</style>