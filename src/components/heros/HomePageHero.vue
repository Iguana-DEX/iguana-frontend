<script lang="ts" setup>
import { computed } from 'vue';

import AppHero from '@/components/heros/AppHero.vue';
import useNetwork from '@/composables/useNetwork';
import useWeb3 from '@/services/web3/useWeb3';

import useBreakpoints from '@/composables/useBreakpoints';

/**
 * COMPOSABLES
 */
const { isWalletReady, isWalletConnecting } = useWeb3();
const { isDesktop } = useBreakpoints();
const { networkSlug } = useNetwork();

/**
 * COMPUTED
 */
const classes = computed(() => ({
  ['h-64']: !isWalletReady.value && !isWalletConnecting.value,
  ['h-60']: isWalletReady.value || isWalletConnecting.value,
}));

const bgHeader = '/images/backgrounds/bg-header.webp';
</script>

<template>
  <AppHero :image="`url(${bgHeader})`" :class="classes">
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
    <div class="flex justify-center mt-6">
      <BalBtn
        tag="a"
        size="lg"
        color="gradient-blue-green"
        rounded
        target="_blank"
        outline
      >
        <router-link
          :to="{ name: 'trade', params: { networkSlug } }"
          class="glow"
        >
          {{ $t('trade') }}
        </router-link>
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
  background-color: rgb(96 165 250);
}

.glow::before {
  content: '';
  position: absolute;
  width: 100px;
  height: 100%;
  background-image: linear-gradient(
    120deg,
    rgb(255 255 255 / 0%) 30%,
    rgb(255 255 255 / 40%),
    rgb(255 255 255 / 0%) 70%
  );
  top: 0;
  left: -100px;
  animation: shine 4s infinite linear;
}
@keyframes shine {
  0% {
    left: -100px;
  }

  20% {
    left: 100%;
  }

  100% {
    left: 100%;
  }
}
</style>