<script lang="ts" setup>
import AppHero from '@/components/heros/AppHero.vue';
import { EXTERNAL_LINKS } from '@/constants/links';
import useWeb3 from '@/services/web3/useWeb3';

import HeroConnectWalletButton from './HeroConnectWalletButton.vue';
import useBreakpoints from '@/composables/useBreakpoints';

import { computed } from 'vue';
import useDarkMode from '@/composables/useDarkMode';

/**
 * COMPOSABLES
 */
const { isWalletReady, isWalletConnecting } = useWeb3();
const { upToLargeBreakpoint } = useBreakpoints();
const { darkMode } = useDarkMode();

const bgHeader = computed((): string => {
  if (darkMode.value) {
    return '/images/backgrounds/dewhales-capital.svg';
  } else {
    return '/images/backgrounds/dewhales-capital-light.svg';
  }
});
</script>

<template>
  <AppHero :image="`url(${bgHeader})`" class="mt-14 w-full aspect-[723/76.5]">
    <div class="flex justify-center mt-6 height=400px">
      <HeroConnectWalletButton
        v-if="!isWalletReady && !isWalletConnecting"
        class="top-24 mr-4"
      />

      <BalBtn
        v-if="!upToLargeBreakpoint"
        tag="a"
        :href="EXTERNAL_LINKS.Dewhales.Twitter"
        target="_blank"
        rel="noreferrer"
        color="white"
        class="top-24"
        outline
      >
        {{ $t('learnMore') }}
        <BalIcon name="arrow-up-right" size="md" class="ml-1 text-bold" />
      </BalBtn>
    </div>
  </AppHero>
</template>

<style>
.headline {
  @apply text-white text-center text-4xl md:text-5xl pb-2 font-display font-black;

  text-shadow: 1px 1px green;
  font-weight: 900;
  font-variation-settings: 'wght' 700;
}

.subheadline {
  @apply mt-1 text-2xl text-white;

  text-shadow: 1px 1px green;
}

.headline_m {
  @apply text-white text-center text-4xl md:text-5xl pb-2 font-display font-black;

  font-weight: 900;
  font-variation-settings: 'wght' 700;
}

.subheadline_m {
  @apply mt-1 text-2xl text-white;
}

.learn_more {
  font-weight: 500;
  text-shadow: '0px 0px green';
}
</style>
