<template>
  <AppHero :class="classes">
    <span v-if="isDesktop">
      <h1
        class="headline"
        v-text="$t('homeOfThe') + $t('digitalMarketIndex')"
      />
      <p class="subheadline" v-text="$t('cryptoInvestingSimple')" />
    </span>
    <span v-else>
      <h1
        class="headline_m"
        v-text="$t('homeOfThe') + $t('digitalMarketIndex')"
      />
      <p class="subheadline_m" v-text="$t('cryptoInvestingSimple')" />
    </span>
    <span>
      <div class="flex justify-center mt-6">
        <HeroConnectWalletButton
          v-if="!isWalletReady && !isWalletConnecting"
          class="mr-4"
        />

        <BalBtn
          v-if="!upToLargeBreakpoint"
          class="learn_more"
          tag="a"
          :href="EXTERNAL_LINKS.Balancer.Docs"
          target="_blank"
          rel="noreferrer"
          color="white"
          outline
        >
          {{ $t('learnMore') }}
          <BalIcon name="arrow-up-right" size="md" class="ml-1 text-bold" />
        </BalBtn>
      </div>
    </span>
  </AppHero>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import AppHero from '@/components/heros/AppHero.vue';
import { EXTERNAL_LINKS } from '@/constants/links';
import useWeb3 from '@/services/web3/useWeb3';

import HeroConnectWalletButton from './HeroConnectWalletButton.vue';

import useBreakpoints from '@/composables/useBreakpoints';

/**
 * COMPOSABLES
 */
const { isWalletReady, isWalletConnecting } = useWeb3();
const { isDesktop, upToLargeBreakpoint } = useBreakpoints();

/**
 * COMPUTED
 */
const classes = computed(() => ({
  ['h-64']: !isWalletReady.value && !isWalletConnecting.value,
  ['h-60']: isWalletReady.value || isWalletConnecting.value,
}));
</script>

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
  background-color: rgb(96 165 250);
}
</style>
