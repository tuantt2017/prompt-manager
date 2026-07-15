<template>
  <div v-if="prompt" class="detail">
    <section class="hero-card">
      <div class="hero-copy">
        <p class="eyebrow">Prompt Detail</p>
        <h2>{{ detailTitle }}</h2>
        <p class="hero-meta">
          <span>{{ authorName }}</span>
          <span class="dot">|</span>
          <span>{{ prompt.model || "Unknown model" }}</span>
          <span class="dot">|</span>
          <span>{{ prompt.date || "No date" }}</span>
        </p>
      </div>

      <div class="hero-badges">
        <div class="badge">
          <span>Rate</span>
          <strong>{{ prompt.rating ?? 0 }}</strong>
        </div>
        <div class="badge">
          <span>Like</span>
          <strong>{{ format(prompt.likes) }}</strong>
        </div>
        <div class="badge">
          <span>View</span>
          <strong>{{ format(prompt.views) }}</strong>
        </div>
      </div>
    </section>

    <div class="detail-grid">
      <n-card class="preview-card" embedded>
        <div class="section-head">
          <div>
            <p class="section-label">Preview</p>
            <h3>Image gallery</h3>
          </div>
          <n-tag v-if="imageCount" round type="info" size="small">
            {{ imageCount }} image{{ imageCount > 1 ? "s" : "" }}
          </n-tag>
        </div>

        <div class="preview-shell" :class="{ empty: !mainImage }">
          <n-image
            v-if="mainImage"
            :src="mainImage"
            width="100%"
            class="main-image"
            object-fit="cover"
            preview-disabled
          />
          <div v-else class="image-placeholder">
            <span>No image available</span>
          </div>
        </div>

        <div v-if="imageList.length > 1" class="thumbs">
          <button
            v-for="img in imageList"
            :key="img"
            type="button"
            class="thumb"
            :class="{ active: currentImage === img || (!currentImage && img === mainImage) }"
            @click="currentImage = img"
          >
            <img :src="img" alt="" />
          </button>
        </div>
      </n-card>

      <div class="side-stack">
        <n-card class="info-card" embedded>
          <div class="section-head">
            <div>
              <p class="section-label">Information</p>
              <h3>Prompt metadata</h3>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Author</span>
              <span class="meta-value">{{ authorName }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Model</span>
              <span class="meta-value">
                <n-tag type="success" round size="small">
                  {{ prompt.model || "Unknown" }}
                </n-tag>
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Score</span>
              <span class="meta-value">{{ prompt.score ?? 0 }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Date</span>
              <span class="meta-value">{{ prompt.date || "No date" }}</span>
            </div>
          </div>

          <div v-if="categories.length" class="category">
            <n-tag v-for="item in categories" :key="item" round type="info">
              {{ item }}
            </n-tag>
          </div>
        </n-card>

        <n-card class="prompt-card" embedded>
          <div class="section-head">
            <div>
              <p class="section-label">Prompt</p>
              <h3>Content and actions</h3>
            </div>
            <div class="prompt-actions">
              <n-button size="small" type="primary" @click="copyPrompt">
                Copy
              </n-button>
              <n-button size="small" @click="copyJson">
                JSON
              </n-button>
            </div>
          </div>

          <n-input
            :value="promptText"
            type="textarea"
            readonly
            autosize
            class="prompt-text"
          />

          <div class="footer-actions">
            <n-button size="small" secondary @click="copyImage" :disabled="!mainImage">
              Copy image URL
            </n-button>
            <n-button size="small" secondary @click="copySource" :disabled="!prompt.source_url">
              Copy source
            </n-button>
            <n-button
              size="small"
              type="success"
              class="open-source-btn"
              :disabled="!prompt.source_url"
              @click="openSource"
            >
              Open source
            </n-button>
          </div>
        </n-card>
      </div>
    </div>
  </div>

  <n-empty
    v-else
    description="Select a prompt to view details"
    class="empty-state"
  />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { usePromptStore } from "../store/promptStore";

const store = usePromptStore();
const currentImage = ref("");
const prompt = computed(() => store.selectedPrompt);

const imageList = computed(() => {
  if (!prompt.value) return [];
  return prompt.value.images?.length ? prompt.value.images : prompt.value.image ? [prompt.value.image] : [];
});

const mainImage = computed(() => {
  if (currentImage.value) return currentImage.value;
  return imageList.value[0] || "";
});

const promptText = computed(() => prompt.value?.prompt || "");

const detailTitle = computed(() => {
  const firstLine = promptText.value.split(/\r?\n/)[0]?.trim() || "";
  if (!firstLine) return "Untitled prompt";
  return firstLine.length > 80 ? `${firstLine.slice(0, 77)}...` : firstLine;
});

const authorName = computed(() => prompt.value?.author_name || prompt.value?.author || "Unknown author");
const categories = computed(() => prompt.value?.categories || []);
const imageCount = computed(() => imageList.value.length);

watch(prompt, () => {
  currentImage.value = "";
});

function format(number) {
  if (!number) return 0;
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
  return number;
}

async function copyText(text) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
}

function safeJson(value) {
  return JSON.stringify(value || {}, null, 2);
}

async function copyPrompt() {
  await copyText(promptText.value);
}

async function copyJson() {
  await copyText(safeJson(prompt.value));
}

async function copyImage() {
  await copyText(mainImage.value);
}

async function copySource() {
  await copyText(prompt.value?.source_url || "");
}

function openSource() {
  if (!prompt.value?.source_url) return;
  window.open(prompt.value.source_url, "_blank", "noopener,noreferrer");
}
</script>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 24px;
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 30%),
    linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.eyebrow,
.section-label {
  margin: 0 0 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #2563eb;
}

.hero-copy h2,
.section-head h3 {
  margin: 0;
  color: #0f172a;
}

.hero-copy h2 {
  font-size: 1.35rem;
  line-height: 1.35;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 0;
  color: #64748b;
}

.dot {
  color: #cbd5e1;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: #fff;
  color: #0f172a;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 16px;
  align-items: start;
}

.side-stack {
  display: grid;
  gap: 16px;
}

.preview-card,
.info-card,
.prompt-card {
  border-radius: 18px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.section-head h3 {
  font-size: 1rem;
}

.preview-shell {
  overflow: hidden;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.preview-shell.empty {
  min-height: 320px;
}

.main-image {
  display: block;
}

.image-placeholder {
  min-height: 320px;
  display: grid;
  place-items: center;
  color: #94a3b8;
  font-weight: 600;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(15, 23, 42, 0.02));
}

.thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.thumb {
  width: 72px;
  height: 72px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb:hover,
.thumb.active {
  transform: translateY(-2px);
  border-color: #2563eb;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18);
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.meta-item {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f8fafc;
}

.meta-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #64748b;
}

.meta-value {
  display: flex;
  align-items: center;
  min-height: 24px;
  font-weight: 600;
  color: #0f172a;
}

.category {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.prompt-actions,
.footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.prompt-text {
  margin-bottom: 14px;
}

.empty-state {
  margin-top: 120px;
}

@media (max-width: 980px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .hero-card {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .meta-grid {
    grid-template-columns: 1fr;
  }

  .section-head {
    flex-direction: column;
  }

  .hero-badges {
    width: 100%;
  }

  .badge {
    flex: 1 1 140px;
    justify-content: center;
  }
}
</style>
