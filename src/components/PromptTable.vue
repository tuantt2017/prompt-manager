<template>

<n-data-table

    :columns="columns"

    :data="store.filteredPrompts"

    :pagination="{

        pageSize:20

    }"

/>

</template>

<script setup>

import { h } from "vue";

import { NImage,NTag } from "naive-ui";

import { usePromptStore } from "../store/promptStore";

const store=usePromptStore();

const columns=[

{

title:"Image",

key:"image",

width:100,

render(row){

return h(NImage,{

width:80,

src:row.image

})

}

},

{

title:"Author",

key:"author"

},

{

title:"Model",

key:"model",

render(row){

return h(NTag,null,{

default:()=>row.model

})

}

},

{

title:"Likes",

key:"likes"

},

{

title:"Views",

key:"views"

},

{

title:"Date",

key:"date"

}

]

</script>