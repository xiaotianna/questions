<template>
  <a
    :href="url"
    :target="target"
    :title="title"
    class="markdown-link"
    :class="{ disabled: disabled }"
    @click="handleClick"
  >
    <span
      v-if="emoji"
      class="emoji-icon"
      >{{ emoji }}</span
    >
    <span class="link-text">{{ description }}</span>
    <span class="link-url">{{ displayUrl }}</span>
  </a>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: '力扣题目链接'
  },
  emoji: {
    type: String,
    default: '🔗'
  },
  target: {
    type: String,
    default: '_blank'
  },
  title: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxUrlLength: {
    type: Number,
    default: 100
  }
})

const displayUrl = computed(() => {
  if (props.url.length <= props.maxUrlLength) {
    return props.url
  }
  return props.url.substring(0, props.maxUrlLength - 3) + '...'
})

const handleClick = (event) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
}
</script>

<style scoped>
.markdown-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: color 0.2s ease;
  overflow: hidden;
}

.markdown-link:hover {
  color: #1d4ed8;
}

.markdown-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.markdown-link:hover::after {
  width: 100%;
}

.emoji-icon {
  font-size: 1.1em;
  line-height: 1;
  margin-right: 0.25rem;
  transition: transform 0.3s ease;
}

.markdown-link:hover .emoji-icon {
  transform: translateX(-2px);
}

.link-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-url {
  margin-left: 0.25rem;
  font-size: 0.875em;
  color: #64748b;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40vw;
}

.markdown-link:hover .link-url {
  color: #475569;
}

.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.disabled:hover::after {
  width: 0;
}
</style>
