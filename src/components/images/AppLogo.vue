<script lang="ts" setup>
import { computed } from 'vue';

import useDarkMode from '@/composables/useDarkMode';
// import useTailwind from '@/composables/useTailwind';

/**
 * TYPES
 */
type Props = {
  forceDark?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  forceDark: false,
});

/**
 * COMPOSABLES
 */
const { darkMode } = useDarkMode();
const useDarkLogo = computed(() => (props.forceDark ? true : darkMode.value));
</script>

<template>
  <div
    class="flex items-center sm:mr-3 transition ease-in transform hover:scale-105 cursor-pointer app-logo"
  >
    <img
      v-if="useDarkLogo"
      src="~@/assets/images/logo-dark.webp"
      alt="IguanaDEX dark logo"
      width="200"
      class="mr-2"
    />
    <img
      v-else
      src="~@/assets/images/logo-light.webp"
      alt="IguanaDEX logo"
      width="200"
      class="mr-2"
    />
  </div>
</template>

<style scoped>
.app-logo :deep(.logotype) {
  @apply origin-top-left relative;

  transform: scale(1.1);
}
</style>
