import { createApp } from "vue";
import { createPinia } from "pinia";

import {
    create,
    NButton,
    NCard,
    NInput,
    NDataTable,
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NImage,
    NImageGroup,
    NSelect,
    NTag,
    NStatistic,
    NGrid,
    NGi,
    NScrollbar,
    NEmpty
} from "naive-ui";

import App from "./App.vue";

const naive = create({
    components: [
        NButton,
        NCard,
        NInput,
        NDataTable,
        NLayout,
        NLayoutSider,
        NLayoutHeader,
        NLayoutContent,
        NImage,
        NImageGroup,
        NSelect,
        NTag,
        NStatistic,
        NGrid,
        NGi,
        NScrollbar,
        NEmpty
    ]
});

const app = createApp(App);

app.use(createPinia());
app.use(naive);

app.mount("#app");
