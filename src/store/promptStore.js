import { defineStore } from "pinia";

export const usePromptStore = defineStore("prompt", {
  state: () => ({
    prompts: [],

    keyword: "",

    model: "",

    category: "",
    selectedPrompt: null,
    favorite: [],

    sortBy: "likes",

    viewMode: "gallery",

    loading: false,
    loadError: "",
  }),

  getters: {
    filteredPrompts(state) {
      return state.prompts.filter((item) => {
        const keyword = state.keyword.toLowerCase();

        const matchKeyword =
          keyword === "" ||
          item.prompt?.toLowerCase().includes(keyword) ||
          item.author?.toLowerCase().includes(keyword);

        const matchModel = state.model === "" || item.model === state.model;

        const matchCategory =
          state.category === "" || item.categories?.includes(state.category);

        return matchKeyword && matchModel && matchCategory;
      });
    },

    models(state) {
      return [...new Set(state.prompts.map((i) => i.model))]

        .filter(Boolean)

        .map((i) => ({
          label: i,
          value: i,
        }));
    },

    categories(state) {
      const arr = [];

      state.prompts.forEach((i) => {
        if (i.categories) arr.push(...i.categories);
      });

      return [...new Set(arr)].map((i) => ({
        label: i,
        value: i,
      }));
    },
    sortedPrompts(state) {
      const arr = [...state.filteredPrompts];

      switch (state.sortBy) {
        case "likes":
          arr.sort((a, b) => b.likes - a.likes);
          break;

        case "views":
          arr.sort((a, b) => b.views - a.views);
          break;

        case "date":
          arr.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;

        case "score":
          arr.sort((a, b) => b.score - a.score);
          break;
      }

      return arr;
    },
  },

  actions: {
    async loadPrompts(url = "/prompts.json") {
      this.loading = true;
      this.loadError = "";

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to load prompts.json: ${response.status}`);
        }

        const data = await response.json();
        this.prompts = Array.isArray(data) ? data : [];

        if (!this.selectedPrompt && this.prompts.length) {
          this.selectedPrompt = this.prompts[0];
        }
      } catch (error) {
        this.prompts = [];
        this.loadError = error instanceof Error ? error.message : "Failed to load prompts";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
