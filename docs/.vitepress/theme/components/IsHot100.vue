<template>
  <span class="hot100-badge">
    <span class="emoji-icon">🔥</span>
    <span class="badge-text">Hot100</span>
  </span>
</template>

<style scoped>
.hot100-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: #fef3c7;
  color: #d97706;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #fbbf24;
  vertical-align: middle;
}

.emoji-icon {
  font-size: 1.1em;
  line-height: 1;
}

.badge-text {
  white-space: nowrap;
}
</style>
