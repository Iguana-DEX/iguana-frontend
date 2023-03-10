<script lang="ts" setup>
const props = defineProps({
  image: { type: String, required: true, default: '' },
});
</script>

<template>
  <div class="app-hero">
    <!-- <div class="mx-auto w-full max-w-lg"> -->
    <div class="mx-auto w-full">
      <slot />
    </div>
  </div>
</template>

<style>
.app-hero {
  @apply bg-cover flex items-center justify-center text-center px-4;

  transition: all 0.3s ease-in-out;
  background-image: v-bind('props.image');
}
</style>
